"use strict";

function toast(_ref) {
  var _ref$title = _ref.title,
      title = _ref$title === void 0 ? "" : _ref$title,
      _ref$message = _ref.message,
      message = _ref$message === void 0 ? "" : _ref$message,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? "info" : _ref$type,
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 3000 : _ref$duration;
  var main = document.getElementById("toast");

  if (main) {
    var _toast = document.createElement("div"); // Auto remove toast


    var autoRemoveId = setTimeout(function () {
      main.removeChild(_toast);
    }, duration + 1000); // Remove toast when clicked

    _toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        main.removeChild(_toast);
        clearTimeout(autoRemoveId);
      }
    };

    var icons = {
      success: "fas fa-check-circle",
      info: "fas fa-info-circle",
      warning: "fas fa-exclamation-circle",
      error: "fas fa-exclamation-circle"
    };
    var icon = icons[type];
    var delay = (duration / 1000).toFixed(2);

    _toast.classList.add("toast", "toast--".concat(type));

    _toast.style.animation = "slideInLeft ease .3s, fadeOut linear 1s ".concat(delay, "s forwards");
    _toast.innerHTML = "\n                      <div class=\"toast__icon\">\n                          <i class=\"".concat(icon, "\"></i>\n                      </div>\n                      <div class=\"toast__body\">\n                          <h3 class=\"toast__title\">").concat(title, "</h3>\n                          <p class=\"toast__msg\">").concat(message, "</p>\n                      </div>\n                      <div class=\"toast__close\">\n                          <i class=\"fas fa-times\"></i>\n                      </div>\n                  ");
    main.appendChild(_toast);
  }
}

function showSuccessToast(message) {
  toast({
    title: "Successfully",
    message: message,
    type: 'success',
    duration: 3000
  });
}

function showErrorToast(message) {
  toast({
    title: "Error",
    message: message,
    type: 'error',
    duration: 3000
  });
}