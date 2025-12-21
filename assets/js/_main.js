/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function () {
  // FitVids init
  $("#main").fitVids();

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").toggleClass("is--visible");
    $(".author__urls-wrapper").find("button").toggleClass("open");
  });

  // Close search screen with Esc key
  $(document).keyup(function (e) {
    if (e.keyCode === 27) {
      if ($(".initial-content").hasClass("is--hidden")) {
        $(".search-content").toggleClass("is--visible");
        $(".initial-content").toggleClass("is--hidden");
      }
    }
  });

  // Search toggle
  $(".search__toggle").on("click", function () {
    $(".search-content").toggleClass("is--visible");
    $(".initial-content").toggleClass("is--hidden");
    // set focus on input
    setTimeout(function () {
      $(".search-content input").focus();
    }, 400);
  });

  // Smooth scrolling
  var scroll = new SmoothScroll('a[href*="#"]', {
    offset: 20,
    speed: 400,
    speedAsDuration: true,
    durationMax: 500,
  });

  // Gumshoe scroll spy init
  if ($("nav.toc").length > 0) {
    var spy = new Gumshoe("nav.toc a", {
      // Active classes
      navClass: "active", // applied to the nav list item
      contentClass: "active", // applied to the content

      // Nested navigation
      nested: false, // if true, add classes to parents of active link
      nestedClass: "active", // applied to the parent items

      // Offset & reflow
      offset: 20, // how far from the top of the page to activate a content area
      reflow: true, // if true, listen for reflows

      // Event support
      events: true, // if true, emit custom events
    });
  }

  // Auto scroll sticky ToC with content
  const scrollTocToContent = function (event) {
    var target = event.target;
    var scrollOptions = { behavior: "auto", block: "nearest", inline: "start" };

    var tocElement = document.querySelector("aside.sidebar__right.sticky");
    if (!tocElement) return;
    if (window.getComputedStyle(tocElement).position !== "sticky") return;

    if (target.parentElement.classList.contains("toc__menu") && target == target.parentElement.firstElementChild) {
      // Scroll to top instead
      document.querySelector("nav.toc header").scrollIntoView(scrollOptions);
    } else {
      target.scrollIntoView(scrollOptions);
    }
  };

  // Has issues on Firefox, whitelist Chrome for now
  if (!!window.chrome) {
    document.addEventListener("gumshoeActivate", scrollTocToContent);
  }

  // add lightbox class to all image links
  $(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']"
  ).has("> img").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: "image",
    tLoading: "Loading image #%curr%...",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: "mfp-zoom-in",
    callbacks: {
      beforeOpen: function () {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace(
          "mfp-figure",
          "mfp-figure mfp-with-anim"
        );
      },
    },
    closeOnContentClick: true,
    midClick: true, // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

  // Add anchors for headings
  (function () {
    var pageContentElement = document.querySelector(".page__content");
    if (!pageContentElement) return;

    pageContentElement
      .querySelectorAll("h1, h2, h3, h4, h5, h6")
      .forEach(function (element) {
        var id = element.getAttribute("id");
        if (id) {
          var anchor = document.createElement("a");
          anchor.className = "header-link";
          anchor.href = "#" + id;
          anchor.innerHTML =
            '<span class="sr-only">Permalink</span><i class="fas fa-link"></i>';
          anchor.title = "Permalink";
          element.appendChild(anchor);
        }
      });
  })();

  // Add copy button for <pre> blocks
  var copyText = function (text) {
    if (document.queryCommandEnabled("copy") && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => true,
        () => console.error("Failed to copy text to clipboard: " + text)
      );
      return true;
    } else {
      var isRTL = document.documentElement.getAttribute("dir") === "rtl";

      var textarea = document.createElement("textarea");
      textarea.className = "clipboard-helper";
      textarea.style[isRTL ? "right" : "left"] = "-9999px";
      // Move element to the same position vertically
      var yPosition = window.pageYOffset || document.documentElement.scrollTop;
      textarea.style.top = yPosition + "px";

      textarea.setAttribute("readonly", "");
      textarea.value = text;
      document.body.appendChild(textarea);

      var success = true;
      try {
        textarea.select();
        success = document.execCommand("copy");
      } catch (e) {
        success = false;
      }
      textarea.parentNode.removeChild(textarea);
      return success;
    }
  };

  var copyButtonEventListener = function (event) {
    var thisButton = event.target;

    // Locate the <code> element
    var codeBlock = thisButton.nextElementSibling;
    while (codeBlock && codeBlock.tagName.toLowerCase() !== "code") {
      codeBlock = codeBlock.nextElementSibling;
    }
    if (!codeBlock) {
      // No <code> found - wtf?
      console.warn(thisButton);
      throw new Error("No code block found for this button.");
    }

    // Skip line numbers if present (i.e. {% highlight lineno %})
    var realCodeBlock = codeBlock.querySelector("td.code, td.rouge-code");
    if (realCodeBlock) {
      codeBlock = realCodeBlock;
    }
    var result = copyText(codeBlock.innerText);
    // Restore the focus to the button
    thisButton.focus();
    if (result) {
      if (thisButton.interval !== null) {
        clearInterval(thisButton.interval);
      }
      thisButton.classList.add('copied');
      thisButton.interval = setTimeout(function () {
        thisButton.classList.remove('copied');
        clearInterval(thisButton.interval);
        thisButton.interval = null;
      }, 1500);
    }
    return result;
  };

  if (window.enable_copy_code_button) {
    document
      .querySelectorAll(".page__content pre.highlight > code")
      .forEach(function (element, index, parentList) {
        // Locate the <pre> element
        var container = element.parentElement;
        // Sanity check - don't add an extra button if there's already one
        if (container.firstElementChild.tagName.toLowerCase() !== "code") {
          return;
        }
        var copyButton = document.createElement("button");
        copyButton.title = "Copy to clipboard";
        copyButton.className = "clipboard-copy-button";
        copyButton.innerHTML = '<span class="sr-only">Copy code</span><i class="far fa-fw fa-copy"></i><i class="fas fa-fw fa-check copied"></i>';
        copyButton.addEventListener("click", copyButtonEventListener);
        container.prepend(copyButton);
      });
  }

  // Ambient background snake animation that avoids text
  (function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var canvas = document.createElement("canvas");
    canvas.id = "ambient-snake";
    canvas.className = "ambient-snake";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var obstacles = [];
    var snake = [];
    var width = 0;
    var height = 0;
    var direction = null;
    var lastTick = 0;
    var speed = 2.4;
    var maxLength = 160;
    var headSize = 8;
    var frameInterval = 32;
    var directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    var debounce = function (fn, delay) {
      var timer;
      return function () {
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(null, args);
        }, delay);
      };
    };

    var collectObstacles = function () {
      var padding = 8;
      var textSelectors =
        "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, header, footer, nav, aside, .page__title, .masthead, .page__meta";
      obstacles = Array.prototype.slice
        .call(document.querySelectorAll(textSelectors))
        .filter(function (element) {
          return element.offsetParent !== null;
        })
        .map(function (element) {
          var rect = element.getBoundingClientRect();
          return {
            left: rect.left - padding,
            right: rect.right + padding,
            top: rect.top - padding,
            bottom: rect.bottom + padding,
          };
        });
    };

    var resizeCanvas = function () {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      collectObstacles();
      if (!snake.length) spawnSnake();
    };

    var collides = function (x, y) {
      if (x < headSize || y < headSize || x > width - headSize || y > height - headSize) {
        return true;
      }
      for (var i = 0; i < obstacles.length; i++) {
        var rect = obstacles[i];
        if (
          x + headSize > rect.left &&
          x - headSize < rect.right &&
          y + headSize > rect.top &&
          y - headSize < rect.bottom
        ) {
          return true;
        }
      }
      return false;
    };

    var spawnSnake = function () {
      for (var i = 0; i < 40; i++) {
        var startX = Math.random() * (width - 2 * headSize) + headSize;
        var startY = Math.random() * (height - 2 * headSize) + headSize;
        if (!collides(startX, startY)) {
          snake = [{ x: startX, y: startY }];
          direction = directions[Math.floor(Math.random() * directions.length)];
          return;
        }
      }
      snake = [{ x: width / 2, y: height / 2 }];
      direction = directions[0];
    };

    var shuffledDirections = function () {
      var pool = directions.slice();
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
      }
      return pool;
    };

    var chooseDirection = function () {
      var head = snake[0];
      var candidates = shuffledDirections().filter(function (option) {
        return !(direction && option.x === -direction.x && option.y === -direction.y);
      });
      for (var i = 0; i < candidates.length; i++) {
        var option = candidates[i];
        var nextX = head.x + option.x * headSize * 1.5;
        var nextY = head.y + option.y * headSize * 1.5;
        if (!collides(nextX, nextY)) return option;
      }
      return direction || candidates[0];
    };

    var step = function (timestamp) {
      if (!lastTick) lastTick = timestamp;
      var delta = timestamp - lastTick;
      if (delta < frameInterval) {
        requestAnimationFrame(step);
        return;
      }
      lastTick = timestamp;

      var head = snake[0];
      var nextDirection = chooseDirection();
      var nextX = head.x + nextDirection.x * speed * (delta / frameInterval);
      var nextY = head.y + nextDirection.y * speed * (delta / frameInterval);

      if (collides(nextX, nextY)) {
        nextDirection = chooseDirection();
        nextX = head.x + nextDirection.x * speed;
        nextY = head.y + nextDirection.y * speed;
      }

      direction = nextDirection;
      snake.unshift({ x: nextX, y: nextY });
      if (snake.length > maxLength) {
        snake.pop();
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = headSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(71, 192, 146, 0.7)";

      ctx.beginPath();
      ctx.moveTo(snake[0].x, snake[0].y);
      for (var i = 1; i < snake.length; i++) {
        ctx.lineTo(snake[i].x, snake[i].y);
      }
      ctx.stroke();

      requestAnimationFrame(step);
    };

    resizeCanvas();
    window.addEventListener("resize", debounce(resizeCanvas, 200));
    window.addEventListener("scroll", debounce(collectObstacles, 200));
    requestAnimationFrame(step);
  })();
});
