function phpvm

    argparse 'l/list' h/help -- $argv

    if set --query _flag_help
        echo "usage: phpvm [options] [command]"
        echo ""
        echo "Set the active php version."
        echo ""
        echo ""
        echo "OPTIONS"
        echo "  -l, --list"
        echo "    Show installed PHP versions."
        echo ""
        echo "  -h, --help"
        echo "    Displays this help manual."

        return 0
    end

    set -l versions ( sudo update-alternatives --list php )

    if set --query _flag_list
        sudo update-alternatives --list php
        return 0
    end

    set -l default 8.1
    set -q argv[1]; or set argv[1] $default
    set -l ver $argv[1]

    set -l binpath /usr/bin/php


    if ! contains $binpath$ver $versions 
        echo "Invalid version: '$ver'"
        return
    end

    sudo update-alternatives --set php $binpath$ver
    php --version

end
