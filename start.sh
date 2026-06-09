#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Contai Electro World website..."
echo ""
echo "Open this link in your browser:"
echo "  http://127.0.0.1:5500"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""
python3 -m http.server 5500 --bind 127.0.0.1
