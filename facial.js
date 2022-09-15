let FALLOS_RESTANTES
TIME_APP_AUTH = 20000
let CURRENT_PHOTO = null;
let idInterval;
let codeApplicant = "";
let codeProcess = "";
let codeAbase ,codePbase ;
// BASE_URL_BACK = "https://desarrollo.oefa.gob.pe/rfa/backend/v1/facial/api";
URL_REDIRECT = "https://desarrollo.oefa.gob.pe/oefa-postulante-evalcas-web/postulante/paginas/facial/postulante_login.jsf?"
BASE_URL_BACK = "http://localhost:8990/v1/facial/api";
modalErrorMessageData = "";
modalErrorTitleData = "";
let a, p;
document.addEventListener(
  "onhaschange",
  () => {
    clearInterval(idInterval);
  },
  false
);

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("body").innerHTML += `

    <div
      class="modal"
      id="modal1"
      data-animation="slideInOutLeft"
      style="z-index: 9999"
    >
      <div
        class="modal-dialog"
        style="
          background: #fff;
          border: 1px solid#f1f1f1;
          box-shadow: inset;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border-radius: 15px;
        "
      >
        <header class="modal-header">
          <h2 style="margin: 1rem auto; font-size: 21px; color: #144aa7">
            ERROR AL AUTENTICAR EL POSTULANTE
          </h2>
        </header>
        <section class="modal-content">
          <p
            style="
              text-align: center;
              padding: 1rem;
              padding-top: 0.2rem;
              font-family: Verdana;
              color: #444;
            "
          >
            Por favor, valide su identidad mire fijamente a la camara y de
            click en el botón guardar.
          </p>
          <p
            id="loading"
            style="margin: auto; width: 100%; text-align: center;display :none"
          >
            validando identidad ...
          </p>
          <p
          id="error_message"
          style="
          font-size: 18px;
          color: rgb(189, 41, 41);
          text-align: center;
          "
          ></p>
          <div
            id="messageErr"
            style="margin: auto; width: 100%; text-align: center;"
          >
            
          </div>
          <p
            id="success_message"
            style="font-size: 18px; color: green; text-align: center"
          ></p>
        </section>
        <button
          style="
            border: none;
            border-radius: 10px;
            margin: auto;
            background-color: #144aa7;
            padding: 7px 14px;
            color: #fff;
            font-size: 14px;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            cursor:pointer
          "
          id="userPhoto"
        >
          VALIDAR
        </button>
      </div>
    </div>
    <div
    class="modalError"
    id="modalError"
    data-animation="slideInOutLeft"
    style="z-index: 9999"
  >
    <div
      class="modal-dialog"
      style="
        background: #fff;
        border: 1px solid#f1f1f1;
        box-shadow: inset;
        padding: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 15px;
      "
    >
      <header class="modal-header">
        <h2 style="margin: 1rem auto; font-size: 21px; color: #144aa7" id="modalErrorTitle">
          Error al activar cámara
        </h2>
      </header>
      <section class="modal-content">
             
        <p
          id="modalErrorMessage"
          style="
            font-size: 18px;
            color: rgb(189, 41, 41);
            text-align: center;
          "
        >
          ${modalErrorMessageData}
       </p>
        
      </section>
      <button

        style="
          border: none;
          border-radius: 10px;
          margin: auto;
          background-color: #144aa7;
          padding: 7px 14px;
          color: #fff;
          font-size: 14px;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          cursor:pointer
        "

        id="modalErrorMessageBtn"
        onClick="ObjCamera.checkPermission()"
      >
        activar
      </button>
    </div>
  </div>

    `;
  const isApplicantExist = await comprobedExistApplicant();
  const isProcessExist = await comprobedExistProcess();
  if (isApplicantExist && isProcessExist) {
    if (a.stages[2].locked) {
      ObjCamera.renderModalErrorBlock();
      setTimeout( ()=> {
        console.log("redirectt");
        // window.location.href = `${URL_REDIRECT}a=${codeAbase}&p=${codePbase}`;
      },2000);
      return;
    }
    ObjCamera.init();
    listenerCapturePhoto();
  } else {
    console.log('object');
    ObjCamera.renderModalError();
    setTimeout( ()=> {
      console.log("redirectt");
      // window.location.href = `${URL_REDIRECT}a=${codeAbase}&p=${codePbase}`;
    },2000);
  }
});

const createModal = () => {};
const getCodes = () => {
  const querystring = window.location.search;
  const params = new URLSearchParams(querystring);
  codeAbase = params.get("a")
  codePbase = params.get("p")
  codeApplicant = atob(params.get("a"));
  codeProcess = atob(params.get("p"));
  return {
    codeApplicant,
    codeProcess,
  };
};
const registerLogAPI = async () => {
  console.log("api");
  const payload = {
    codeApplicant,
    codeProcess,
    pictureCompare: "CURRENT_PHOTO",
    pictureRegister: "",
    stageType: 3,
    thresholdAccepted: 80,
  };
  try {
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
    };

    options.body = JSON.stringify(payload);
    const e = await fetch(`${BASE_URL_BACK}/log-api`, options);
    return e.json();
    // const response = await fetch(`${BASE_URL_BACK}/log-api`, {
    //   method: 'POST',
    //   headers: {

    //   },
    //   body: payload,
    // });
    // console.log(response);
    // return response.json();
  } catch (error) {}
};
const getApplicant = async (applicantCode) => {
  try {
    const response = await fetch(
      `${BASE_URL_BACK}/applicants/code/${applicantCode}`
    );
    if (response.status === 404) throw response.statusText;
    return response.json();
  } catch (error) {
    throw error;
  }
};
const getProccess = async (processCode) => {
  try {
    const response = await fetch(
      `${BASE_URL_BACK}/process/code/${processCode}`
    );
    if (response.status === 404) throw response.statusText;
    return response.json();
  } catch (error) {
    throw error;
  }
};

const TRIGGER_INIT = (INTERVAL) => {
  idInterval = setInterval(async () => {
    CURRENT_PHOTO = ObjCamera.takepicture();
    const response = await COMPARE_PICTURES(CURRENT_PHOTO);

    if (response.isError && FALLOS_RESTANTES > 0) {
      clearInterval(idInterval);
      console.log(`LE QUEDAN ${FALLOS_RESTANTES} intentos`);
      document.getElementById("modal1").classList.add("is-visible");
    }
    if (response.isError && FALLOS_RESTANTES == 0) {
      setTimeout( ()=> {
        window.location.href = `${URL_REDIRECT}a=${codeAbase}&p=${codePbase}`;
      },2000);
      clearInterval(idInterval);
      console.log("se bloqueo");
    }
  }, INTERVAL);
};

const COMPARE_PICTURES = async (photo) => {
  let response = await registerLogAPI();
  console.log(response);
  response.success = response.isError ? true : false;
  FALLOS_RESTANTES = response.remainingAttempts;
  return response;
};
const comprobedExistApplicant = async () => {
  const { codeApplicant } = getCodes();
  return getApplicant(codeApplicant)
    .then((applicant) => {
      a = applicant;
      return true;
    })
    .catch((err) => {
      return false;
    });
};
const comprobedExistProcess = async () => {
  const { codeProcess } = getCodes();
  return getProccess(codeProcess)
    .then((process) => {
      p = process;
      return true;
    })
    .catch((err) => {
      return false;
    });
};

const el = document.querySelectorAll("[data-open]")[0];
const closeEl = document.querySelectorAll("[data-close]")[0];
const isVisible = "is-visible";

const ObjCamera = {
  init: () => {
    ObjCamera.render();
    setTimeout(() => {
      ObjCamera.active();
    }, 100);
  },
  render: () => {
    const $html = `
        <div style="position:fixed;bottom:100px;left:10px;height:60px;width:60px">
            <video width="100px" height="100px"id="video"></video>
            <canvas id="canvas"></canvas>
        </div>
        `;
    document.querySelector("body").innerHTML += $html;
  },
  active: () => {
    ObjCamera.$video = document.querySelector("#video");
    ObjCamera.$canvas = document.querySelector("#canvas");
    ObjCamera.$startbutton = document.querySelector("#startbutton");
    ObjCamera.streaming = false;
    const width = 50;
    let height = 0;
    ObjCamera.checkPermission();
    ObjCamera.$video.addEventListener(
      "canplay",
      function (ev) {
        if (!ObjCamera.streaming) {
          height =
            ObjCamera.$video.videoHeight / (ObjCamera.$video.videoWidth / 100);
          ObjCamera.$video.setAttribute("width", 100);
          ObjCamera.$video.setAttribute("height", height);
          ObjCamera.streaming = true;
        }
      },
      false
    );
  },
  checkPermission: () => {
    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          console.log("correct");
          ObjCamera.hideModalError();
          ObjCamera.$video.srcObject = stream;
          ObjCamera.$video.play();
          ObjCamera.streaming = true;
          TRIGGER_INIT(TIME_APP_AUTH);
        })
        .catch((err) => {
          console.log(err);
          console.log("error");

          ObjCamera.streaming = false;
          if (err?.message === "Permission denied") {
            modalErrorMessageData =
              "Permiso denegado, intente nuevamente aprobando el acceso";
          } else {
            modalErrorMessageData =
              "Es posible que no tenga su cámara conectada. Inténtelo de nuevo...";
          }
          modalErrorTitleData = "Error al activar su cámara.";
          ObjCamera.renderModalError();
        });
    }
  },

  takepicture: () => {
    ObjCamera.$video.pause();
    const contexto = ObjCamera.$canvas.getContext("2d");
    ObjCamera.$canvas.width = ObjCamera.$video.videoWidth;
    ObjCamera.$canvas.height = ObjCamera.$video.videoHeight;
    contexto.drawImage(
      video,
      0,
      0,
      ObjCamera.$canvas.width,
      ObjCamera.$canvas.height
    );
    const foto = canvas.toDataURL();
    ObjCamera.$canvas.width = 0;
    ObjCamera.$canvas.height = 0;
    const base64String = foto.replace("data:", "").replace(/^.+,/, "");
    ObjCamera.$video.play();
    return base64String;
  },
  renderModalErrorBlock: () => {
    const btnModalError = document.querySelector("#modalErrorMessageBtn");
    btnModalError.style.display = "none";

    const modalErrorNode = document.querySelector(".modalError");
    modalErrorNode.classList.add("is-visible");

    document.querySelector(
      "#modalErrorMessage"
    ).innerHTML = `<div style="width:350px;color: #144aa7">Usted a sido bloqueado, por favor comuníquese con el Administrador.</div>`;
    document.querySelector("#modalErrorTitle").textContent =
      "USUARIO BLOQUEADO";
  },
  renderModalError: () => {
    const btnModalError = document.querySelector("#modalErrorMessageBtn");
    btnModalError.style.display = "block";

    const modalErrorNode = document.querySelector(".modalError");
    const modalNode = document.querySelector(".modal");
    modalErrorNode.classList.add("is-visible");
    document.querySelector("#modalErrorMessage").textContent =
      modalErrorMessageData;
    document.querySelector("#modalErrorTitle").textContent =
      modalErrorTitleData;
    modalNode.classList.remove("is-visible");
  },
  hideModalError: () => {
    const btnModalError = document.querySelector("#modalErrorMessageBtn");
    btnModalError.style.display = "block";
    const modalErrorNode = document.querySelector(".modalError");
    modalErrorNode.classList.remove("is-visible");
  },

  renderModal: () => {
    const modalErrorNode = document.querySelector(".modalError");
    const modalNode = document.querySelector(".modal");
    modalNode.classList.add("is-visible");
    modalErrorNode.classList.remove("is-visible");
  },
};

const listenerCapturePhoto = () => {
  document.querySelector("#userPhoto").addEventListener(
    "click",
    async function (ev) {
      const $btnTakePicture = ev.target;
      $btnTakePicture.disable = true;
      CURRENT_PHOTO = ObjCamera.takepicture();
      document.querySelector("#loading").style.display = "block";
      
      const response = await COMPARE_PICTURES(CURRENT_PHOTO);
      document.querySelector("#loading").style.display = "none";
      $btnTakePicture.disable = false;

      if (response.isError) {
        if (FALLOS_RESTANTES > 0) {
          document.querySelector("#error_message").style.display = "block";
          document.querySelector("#error_message").innerHTML =
            "ERROR EN LA AUTENTICACIÓN REPITA EL PROCESO";
          document.querySelector("#messageErr").textContent = `LE QUEDAN ${FALLOS_RESTANTES} intentos`
          console.log(`LE QUEDAN ${FALLOS_RESTANTES} intentos`);
        }

        if (FALLOS_RESTANTES == 0) {
          document.querySelector("#error_message").style.display = "block";

          document.querySelector("#error_message").innerHTML =
            "USUARIO BLOQUEADO";
          console.log(`LE QUEDAN ${FALLOS_RESTANTES} intentos`);
          setTimeout( ()=> {
            window.location.href = `${URL_REDIRECT}a=${codeAbase}&p=${codePbase}`;
          },2000);
        }
      } else {
        document.querySelector(
          "#error_message"
        ).innerHTML = `<div style="width:350px;color: #144aa7">Autenticación correcta.</div>`;

        TRIGGER_INIT(TIME_APP_AUTH);
        document.querySelector(".modal.is-visible").classList.remove(isVisible);
        document.querySelector("body").classList.remove("modal_visible");
      }
    },
    false
  );
};

let css = `.btn-group {
    text-align: center;
  }

  .open-modal {
    font-weight: bold;
    background: var(--blue);
    color: var(--white);
    padding: 0.75rem 1.75rem;
    margin-bottom: 1rem;
    border-radius: 5px;
  }


  .modal, .modalError {
    
    background-color: rgba(0,0,0,.3);
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    // background: var(--black);
    cursor: pointer;
    visibility: hidden;
    opacity: 0;
    transition: all 0.35s ease-in;
  }

  .modal.is-visible, .modalError.is-visible {
    visibility: visible;
    opacity: 1;
  }

  .modal-dialog {
    position: relative;
    max-width: 800px;
    max-height: 80vh;
    border-radius: 5px;
    background: var(--white);
    overflow: auto;
    cursor: default;
  }

  .modal-dialog > * {
    padding: 1rem;
  }

  .modal-header,
  .modal-footer {
    background: var(--lightgray);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-header .close-modal {
    font-size: 1.5rem;
  }

  .modal p + p {
    margin-top: 1rem;
  }

  [data-animation] .modal-dialog {
    opacity: 0;
    transition: all 0.5s var(--bounceEasing);
  }

  [data-animation].is-visible .modal-dialog {
    opacity: 1;
    transition-delay: 0.2s;
  }

  [data-animation="slideInOutDown"] .modal-dialog {
    transform: translateY(100%);
  }

  [data-animation="slideInOutTop"] .modal-dialog {
    transform: translateY(-100%);
  }

  [data-animation="slideInOutLeft"] .modal-dialog {
    transform: translateX(-100%);
  }

  [data-animation="slideInOutRight"] .modal-dialog {
    transform: translateX(100%);
  }

  [data-animation="zoomInOut"] .modal-dialog {
    transform: scale(0.2);
  }

  [data-animation="rotateInOutDown"] .modal-dialog {
    transform-origin: top left;
    transform: rotate(-1turn);
  }

  [data-animation="mixInAnimations"].is-visible .modal-dialog {
    animation: mixInAnimations 2s 0.2s linear forwards;
  }

  [data-animation="slideInOutDown"].is-visible .modal-dialog,
  [data-animation="slideInOutTop"].is-visible .modal-dialog,
  [data-animation="slideInOutLeft"].is-visible .modal-dialog,
  [data-animation="slideInOutRight"].is-visible .modal-dialog,
  [data-animation="zoomInOut"].is-visible .modal-dialog,
  [data-animation="rotateInOutDown"].is-visible .modal-dialog {
    transform: none;
  }
  .modal_visible {
    background: rgba(0,0,0,.4)
  }
`,
  head = document.head || document.getElementsByTagName("head")[0],
  style = document.createElement("style");

head.appendChild(style);

style.type = "text/css";
if (style.styleSheet) {
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}
