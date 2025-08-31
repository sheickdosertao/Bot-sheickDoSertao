
#!/bin/bash

NOCOLOR='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
PURPLE='\033[1;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'

clear


while :
do
echo "${GREEN}"
echo "╔═══════════════════════════════════════════════╗"
echo "║                                               ║"
echo "║        BEM-VINDO A SheicdoSertao-bot                   ║"
echo "║                                               ║"
echo "╚═══════════════════════════════════════════════╝"

echo "${YELLOW}             Desenvolvido por: GeBe Mods${NOCOLOR}"

echo "${PURPLE}"
echo "╔═══════════════════════╗"
echo "║ 💜 Insta: @brenno_diego_ferreira    ║"
echo "║ 💜 YouTube: @hackerestudio ║"
echo "╚═══════════════════════╝"

echo "${WHITE}⏳ Iniciando o bot...${NOCOLOR}"
echo ""

node index.js

echo ""
echo "${CYAN}🔄 Reiniciando SheickDoSertao-Bot em 1 segundo...${NOCOLOR}"
sleep 1
clear
done

