$( function() {
    var pictures = [],
        $pointer = $( '#pointer' ),
        $thumbnails = $( '#thumbnails' ),
        $title = $( '#title' ),
        $pause = $( '#pause' ),
        $flash = $( '#flash' ),
        $volume = $( '#volume' );

    // Buzz audio library

    buzz.defaults.formats = [ 'ogg', 'mp3' ];

    var trafficSound = new buzz.sound( 'sounds/traffic' ),
        clickSound = new buzz.sound( 'sounds/click' ),
        focusSound = new buzz.sound( 'sounds/focus' ),
        rewindSound = new buzz.sound( 'sounds/rewind' ),
        cameraSounds = new buzz.group( clickSound, focusSound, rewindSound );

    if ( !buzz.isSupported() ) {
        $volume.hide();    
    }
    
    trafficSound.loop().play().fadeIn( 5000 );

    // jScrollPane

    $thumbnails.find( 'ul' ).width( function() {
        var totalWidth = 0;
        $( this ).find( 'li' ).each( function() {
            totalWidth += $( this ).outerWidth( true );
        });
        return totalWidth;
    });

    $thumbnails.jScrollPane();

    var jScrollPaneApi = $thumbnails.data( 'jsp' );

    $( window ).bind( 'resize', function() {
        jScrollPaneApi.reinitialise();
    });

    // Vegas Background

    $thumbnails.find( 'a' ).each( function() {
        pictures.push({
            src: $( this ).attr( 'href' ),    
            title: $( this ).find( 'img' ).attr( 'title' ),
            valign: $( this ).find( 'img' ).data( 'valign' )
        });
    })

    $.vegas( 'slideshow', { 
        backgrounds: pictures,
        delay: 4000
     })( 'overlay' );
    
    $( 'body' ).bind( 'vegasload', function( e, img ) {
        var src = $( img ).attr( 'src' ),
            idx = $( 'a[href="' + src + '"]' ).parent( 'li' ).index();

        focusSound.play();
    
        $title.fadeOut( function() {
            $( this ).find( 'h1' ).text( pictures[ idx ].title );
            $( this ).fadeIn();
        });

        $flash.show().fadeOut( 1000 );

        var pointerPosition = $thumbnails.find( 'li' ).eq( idx ).position().left;
            
        $pointer.animate({
            left: pointerPosition
        }, 500, 'easeInOutBack' );

        if ( ( pointerPosition > $thumbnails.width() || pointerPosition < jScrollPaneApi.getContentPositionX() ) && !$thumbnails.is( ':hover' ) ) {
            jScrollPaneApi.scrollToX( pointerPosition, true );
        }

        $pointer.click( function() {
            $thumbnails.find( 'a' ).eq( idx ).click()
        });
    });

    // Volume button

    $volume.click( function() {
        if ( $( this ).hasClass( 'all' ) ) {
            cameraSounds.unmute();
            trafficSound.mute();
        
            $( this ).removeClass( 'all' ).addClass( 'some' );
        } else if ( $( this ).hasClass( 'some' ) ) {
            cameraSounds.mute();
            trafficSound.mute();
        
            $( this ).removeClass( 'some' ).addClass( 'none' );
        } else {
            cameraSounds.unmute();
            trafficSound.unmute();
        
            $( this ).removeClass( 'none' ).addClass( 'all' );
        }
        return false;
    });

    // Photograph

    $thumbnails.find( 'a' ).click( function() {
        $pause.show();
        $pointer.hide();
    
        $volume.animate( { top: '20px' });
        $thumbnails.animate( { top: '-90px' });
        $title.animate( { bottom: '-90px' });    

        var idx = $( this ).parent( 'li' ).index();
        $.vegas( 'slideshow', { step: idx } )( 'pause' );

        rewindSound.play();
    
        return false;
    });

    $pause.click( function() {
        $pause.hide();
        $pointer.show();
    
        $volume.animate( { top:'100px' });
        $title.animate( { bottom:'0px' });
        $thumbnails.animate( { top:'0px' });

        $.vegas( 'slideshow' );

        clickSound.play();

        return false;
    });
});