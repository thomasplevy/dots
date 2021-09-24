( () => {

	const $main = document.querySelector( 'main' );

	function addGroup( { title, icon, links } ) {
		addLinksToGroup( getGroupEl( title, icon ), links );
	}

	function addLinksToGroup( $group, links ) {

		const $list = document.createElement( 'ul' );
		links.forEach( link => {
			$list.appendChild( getLinkEl( link ) );
		} );
		$group.appendChild( $list );

	}

	function getLinkEl( { title, icon, url } ) {
		const $a = document.createElement( 'a' );
			$li = document.createElement( 'li' );

		$a.id = nameToId( title, 'link' )
		$a.innerHTML = `<i class="${ icon }"></i> <div>${ title }</div>`;
		$a.href = url;

		$li.appendChild( $a );

		return $li;

	}

	function nameToId( name, prefix = '' ) {
		name = name.toLowerCase().replace( ' ', '-' );
		if ( prefix ) {
			name = prefix + '-' + name;
		}
		return name;
	}

	function getGroupEl( title, icon ) {

		const $group = document.createElement( 'div' ),
			groupId = nameToId( title, 'group' ),
			$openAll = document.createElement( 'a' );

		$openAll.href = '#';
		$openAll.classList.add( 'open-all' );
		$openAll.dataset.group = groupId;
		$openAll.innerHTML = 'Open all <i class="fas fa-external-link-alt"></i>';
		$openAll.onclick = ( e ) => {
			e.preventDefault();
			document.querySelectorAll( `#${ groupId } ul li a` ).forEach( ( { href } ) => {
				window.open( href, '_blank' );
			} );
		};

		$group.id = groupId;
		$group.innerHTML = `<h2><i class="${ icon }"></i> ${ title }</h2>`;
		$group.appendChild( $openAll );

		$main.appendChild( $group );

		return $group;

	}

	function addGroups( list ) {
		list.forEach( ( group ) => addGroup( group ) );
	}

	function storeImage( img ) {

		const canvas = document.createElement( 'canvas' );
		canvas.width = img.width;
		canvas.height = img.height;

		console.log( canvas.width, canvas.height );

		document.body.appendChild( canvas );

		const ctx = canvas.getContext( '2d' );
		ctx.drawImage( img, 0, 0 );

	    localStorage.setItem( 'bgImg', canvas.toDataURL() );
	    localStorage.setItem( 'bgImgCreated', Date.now() );

	}

	fetch( 'links.json' ).then( res => res.json() ).then( res => addGroups( res ) );

	let shouldStoreImg = false;

	function getImageSrc() {

		// const cached = localStorage.getItem( 'bgImg' ),
		// 	cacheAge = localStorage.getItem( 'bgImgCreated' );

		// if ( cacheAge && cacheAge + 21600 >= Date.now()  ) {
		// 	return cached;
		// }

		const keywords = [ 'water', 'mountains', 'trees', 'sky' ],
			keyword = keywords[ Math.floor( Math.random() * ( keywords.length - 1 ) + 1 ) ];

		shouldStoreImg = true;

		return `https://source.unsplash.com/featured/1920x1280?${ keyword }`

	}

	new Promise( ( resolve, reject ) => {

		const image = new Image();
		image.src = getImageSrc();
		image.id = 'background-image';
		image.crossOrigin = 'anonymous';
		image.onload = () => resolve ( image );

	} ).then( img => {
		
		document.body.appendChild( img );

		if ( shouldStoreImg ) {
			// storeImage( img );
		}

		setTimeout( () => {
			img.style.opacity = 1;
		}, 300 );

	} );

} )();
