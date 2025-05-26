particlesJS("particles-js", {
  particles: {
    number: {
      value: 44,
      density: {
        enable: true,
        value_area: 900
      }
    },
    color: {
      value: ["#bfae9e", "#e6d8c3", "#d8cbb3", "#cfc2a7", "#a89c87"] // beige palette
    },
    shape: {
      type: ["circle", "triangle", "polygon", "star"],
      stroke: {
        width: 2,
        color: "#fff8e1"
      },
      polygon: {
        nb_sides: 5
      }
    },
    opacity: {
      value: 0.8,
      random: true,
      anim: {
        enable: true,
        speed: 0.7,
        opacity_min: 0.18,
        sync: false
      }
    },
    size: {
      value: 26,
      random: true,
      anim: {
        enable: true,
        speed: 3,
        size_min: 10,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 140,
      color: "#e6d8c3", // beige line
      opacity: 0.22,
      width: 2.5
    },
    move: {
      enable: true,
      speed: 1.1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "bubble"
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 200,
        size: 40,
        duration: 2,
        opacity: 0.9,
        speed: 2
      },
      grab: {
        distance: 220,
        line_linked: {
          opacity: 0.7
        }
      },
      repulse: {
        distance: 120,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
});
