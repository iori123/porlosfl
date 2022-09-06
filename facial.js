let FALLOS_RESTANTES=5,CURRENT_PHOTO=null,idInterval;document.addEventListener("DOMContentLoaded",()=>{document.querySelector("body").innerHTML+=`   <div
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
          click en el bot\xf3n guardar.
        </p>
        <p
          id="loading"
          style="margin: auto; width: 100%; text-align: center"
        >
          validando ...
        </p>
        <p
          id="error_message"
          style="
            font-size: 18px;
            color: rgb(189, 41, 41);
            text-align: center;
          "
        ></p>
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
`,ObjCamera.init(),listenerCapturePhoto()});const createModal=()=>{},TRIGGER_INIT=(a,b)=>{idInterval=setInterval(async()=>{CURRENT_PHOTO=ObjCamera.takepicture();let a=await COMPARE_PICTURES(CURRENT_PHOTO);!a.success&&FALLOS_RESTANTES>0&&(document.querySelector("body").classList.toggle("modal_visible"),clearInterval(idInterval),console.log(`LE QUEDAN ${FALLOS_RESTANTES} intentos`),document.getElementById("modal1").classList.add("is-visible")),a.success||0!=FALLOS_RESTANTES||(document.querySelector("body").classList.toggle("modal_visible"),clearInterval(idInterval),console.log("se bloqueo"))},a)},COMPARE_PICTURES=async b=>{let a={success:!1};return FALLOS_RESTANTES=a.success?FALLOS_RESTANTES:FALLOS_RESTANTES-1,{success:!1}},el=document.querySelectorAll("[data-open]")[0],closeEl=document.querySelectorAll("[data-close]")[0],isVisible="is-visible",ObjCamera={init(){ObjCamera.render(),setTimeout(()=>{ObjCamera.active()},100)},render(){let a=`
        <div style="position:fixed;bottom:100px;left:10px;height:60px;width:60px">
            <video width="100px" height="100px"id="video"></video>
            <canvas id="canvas"></canvas>
        </div>
        `;document.querySelector("body").innerHTML+=a},active(){ObjCamera.$video=document.querySelector("#video"),ObjCamera.$canvas=document.querySelector("#canvas"),ObjCamera.$startbutton=document.querySelector("#startbutton");let a=!1,b=0;navigator.getMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia,navigator.mediaDevices.getUserMedia&&navigator.mediaDevices.getUserMedia({video:!0,audio:!1}).then(b=>{ObjCamera.$video.srcObject=b,ObjCamera.$video.play(),a=!0,console.log(b),TRIGGER_INIT(1e3)}),ObjCamera.$video.addEventListener("canplay",function(c){a||(b=ObjCamera.$video.videoHeight/(ObjCamera.$video.videoWidth/100),ObjCamera.$video.setAttribute("width",100),ObjCamera.$video.setAttribute("height",b),a=!0)},!1)},takepicture(){ObjCamera.$video.pause();let b=ObjCamera.$canvas.getContext("2d");ObjCamera.$canvas.width=ObjCamera.$video.videoWidth,ObjCamera.$canvas.height=ObjCamera.$video.videoHeight,b.drawImage(video,0,0,ObjCamera.$canvas.width,ObjCamera.$canvas.height);let c=canvas.toDataURL();ObjCamera.$canvas.width=0,ObjCamera.$canvas.height=0;let a=c.replace("data:","").replace(/^.+,/,"");return console.log(a),ObjCamera.$video.play(),a}},listenerCapturePhoto=()=>{document.querySelector("#userPhoto").addEventListener("click",async function(a){await COMPARE_PICTURES(CURRENT_PHOTO=ObjCamera.takepicture()),FALLOS_RESTANTES>0&&(document.querySelector("#loading").style.display="block",setTimeout(()=>{document.querySelector("#loading").style.display="none",document.querySelector("#error_message").style.display="block",document.querySelector("#error_message").innerHTML="ERROR EN LA AUTENTICACI\xd3N REPITA EL PROCESO",console.log(`LE QUEDAN ${FALLOS_RESTANTES} intentos`)},2e3)),2==FALLOS_RESTANTES&&(document.querySelector("#loading").style.display="block",setTimeout(()=>{document.querySelector("#loading").style.display="none",document.querySelector("#error_message").style.display="none",document.querySelector("#success_message").innerHTML="AUTENTICACI\xd3N CORRECTA PROSIGA CON EL EX\xc1MEN.",setTimeout(()=>{document.querySelector("#success_message").style.display="none",document.querySelector(".modal.is-visible").classList.remove("is-visible"),TRIGGER_INIT(5e3)},1e3),console.log(`LE QUEDAN ${FALLOS_RESTANTES} intentos`)},2e3)),0==FALLOS_RESTANTES&&(document.querySelector("#loading").style.display="block",setTimeout(()=>{document.querySelector("#loading").style.display="none",document.querySelector("#error_message").style.display="block",document.querySelector("#error_message").innerHTML="USUARIO BLOQUEADO",console.log(`LE QUEDAN ${FALLOS_RESTANTES} intentos`)},2e3),console.log("se bloqueo"))},!1)};var css=`.btn-group {
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


  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: var(--black);
    cursor: pointer;
    visibility: hidden;
    opacity: 0;
    transition: all 0.35s ease-in;
  }

  .modal.is-visible {
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
`,head=document.head||document.getElementsByTagName("head")[0],style=document.createElement("style");head.appendChild(style),style.type="text/css",style.styleSheet?style.styleSheet.cssText=css:style.appendChild(document.createTextNode(css))
