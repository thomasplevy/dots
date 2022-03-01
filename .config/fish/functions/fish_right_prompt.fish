function fish_right_prompt -d "Write out the right prompt"

    if test "am" = "( date '+%P' )" 
        set ampm a
    else
        set ampm p
    end

    set -l green ( set_color -o green ) 
    set -l normal (set_color normal)
    set -l date ( date '+%I:%M:%S' )
    echo $green\[$normal$date$ampm$green\]

end