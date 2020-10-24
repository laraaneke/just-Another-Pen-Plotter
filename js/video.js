let w;
let movingh = 150;
let x = 0;
let imgdata;
let playing;
let videoPlaybtn;
let savebtn;
let data;
let img;
let c;
let topbtn;
function setup() {
  c = createCanvas(500, 500);
  c.addClass("mx-auto");
  background(204);
  pixelDensity(displayDensity());
  imageMode(CORNER);
  w = 500;
  h = 500;
  stroke(0);
  noFill();
  capture = createCapture(
    {
      audio: false,
      video: {
        width: w,
        height: h,
      },
    },
    function () {
      console.log("capture ready.");
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.id("vidplay");
  capture.hide();
  videoPlaybtn = createButton("Pause video");

  savebtn = createButton("Save a still");
  savebtn.mousePressed(savesnap);

  savebtn.addClass("btn btn-outline-danger mx-auto");
  videoPlaybtn.addClass("btn btn-outline-danger mx-auto ");
  videoPlaybtn.elt.setAttribute("id", "vidbtn");
  videoPlaybtn.mousePressed(PausePlay);
  savebtn.elt.setAttribute("id", "savebtn");
  playing = false;
  background(255);
}
function PausePlay() {
  // if playing is true
  if (!playing) {
    // make the video pause
    capture.pause();
    // playing = false;
    // c.elt.toDataURL("image/jpeg", 1.0);
    videoPlaybtn.html("press play to start camera again");
  }
  // else let the video play
  else {
    capture.play();
    // playing = true;
    videoPlaybtn.html("capture");
  }
  playing = !playing;
}

function draw() {
  capture.loadPixels();
   image(capture, 0, 0);
//  moving();
  capture.updatePixels();
  // console.log(frameCount);
}
function moving() {
  let ww = capture.width;
  let hh = capture.height;
  let yy = floor((noise(0.85 * frameCount) * hh) / 2);
  let xx = floor(random(ww / 2 - 130, ww / 2 + 130));
  let dx = 0;
  let rando = random(30);

  let newh = 150; // let l = copy(capture, ww / 2, 0, 1, h, 0, 0, 1, h);

  copy(
    capture,
    int(xx * sin(xx + 0.2) * 0.2),
    yy,
    ww + dx,
    newh + (dx + 1),
    0,
    movingh + dx,
    width,
    newh + dx
  );

  //xywh of src then xywh of dest

  // if (frameCount % 60 == 1) {
  //   if (movingh < hh) {
  //     movingh = movingh + newh;
  //   } else {
  //     movingh = 0;
  //   }
  // }
  if (movingh < hh) {
    movingh = movingh + newh;
    xx = xx + 1;
    dx += 1;
  } else {
    movingh = 0;
    xx = 0;
    dx = 0;
  }

  // capture.updatePixels();

  // console.log(frameCount);
}

function savesnap() {
  imgdata = c.elt.toDataURL("image/png");
  // console.log("saved");
  // console.log("data", imgdata);
  let im = document.getElementById("imageSrc");

  im.src = imgdata;
}
