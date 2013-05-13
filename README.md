# [Stickymenu.js](http://demos.abhighosh.co.uk/stickymenu)

Stickymenu.js is a lightweight jQuery plugin for neatly and smoothly keeping menus and other ui elements visible at the top of a page.

* Source: [https://github.com/abhighosh/stickymenu/archive/master.zip](https://github.com/abhighosh/stickymenu/archive/master.zip)
* Homepage: [http://demos.abhighosh.co.uk/stickymenu](http://demos.abhighosh.co.uk/stickymenu)


## Quick start

1. Download latest version of stickymenu.js

2. Include jQuery

```javascript
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
 ```

3. Include stickymenu.js with a path to the containing folder

```javascript
<script src="js/jquery.stickymenu.js"></script>
 ```

4. Initialise sticky menu.

```javascript
<script>
$(document).ready(function(){
   $("#stickymenu").stickymenu();
  });
  </script>
 ```


## Features

* Touch friendly
* Cross browser compatible (IE6+, Chrome, Safari, Firefox)

## Options

Options

This example makes the element with id 'stickymenu' stick to the top with an offset of 100px.

```javascript
<script>
$(document).ready(function(){
   $("#stickymenu").stickymenu({offset: 100px});
  });
  </script>
 ```
 
This example makes the element with id 'stickymenu' stick to the top with an offset of 100px and unsticks it when below 480px in width.
 
 ```javascript
<script>
  $(document).ready(function(){
   $("#stickymenu").stickymenu({offset: 100, minWidth: 480});
  });
</script>
 ```
 
This example makes the element with id 'stickymenu' stick to the top and disables animations for any browser.

```javascript
<script>
  $(document).ready(function(){
   $("#stickymenu").stickymenu({neverAnimate: true});
  });
</script>
 ```
 
This example makes the element with id 'stickymenu' stick to the top and disables sticking if on a touch enabled device.

```javascript
<script>
  $(document).ready(function(){
   $("#stickymenu").stickymenu({touchDisable: true});
  });
</script>
 ```
 
This example makes the element with id 'stickymenu' stick to the top and changes animation duration when enabled (e.g. on touch devices) to a duration of 1000ms.

```javascript
<script>
  $(document).ready(function(){
   $("#stickymenu").stickymenu({duration: 1000});
  });
</script>
 ```