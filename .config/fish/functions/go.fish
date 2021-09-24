set go_cmd_dir ~/srv/www/llms/htdocs/wp-content/plugins/

function go

	set -l dir $go_cmd_dir$argv[1]
	set -l cwd (pwd)

	echo $dir

	if not test -d $dir
		echo Directory "$argv" does not exist.
		return 1
	end

	cd $dir
	if [ '-w' = $argv[2] ]
		gh repo view --web
		cd $cwd
	end
	
end

complete --command go --arguments '( ls -A $go_cmd_dir )'