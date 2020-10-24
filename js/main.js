let points;
      let imgElement = document.getElementById("imageSrc");
      let inputElement = document.getElementById("fileInput");
      let gcode = "";
      let is_pen_down;
      let STYLOS_X_OFFSET = 20;
      let STYLOS_Y_OFFSET = 50;
      let DRAW_X_OFFSET = 70;
      let DRAW_Y_OFSSET = 70;
      let SPEED = 3600;
      let canvas6 = document.getElementById("foreach");
      let ctx6 = canvas6.getContext("2d");
      let clearbtn = document.getElementById("clearbtn");

      ////////////////////////////////////////////////////////////////

      //get image from computer and chagethe img source attr
      inputElement.addEventListener(
        "change",
        (e) => {
          imgElement.src = URL.createObjectURL(e.target.files[0]);
        },
        false
      );

      imgElement.onload = function () {
        //when image has loaded
        let src = cv.imread(imgElement); //image we want to change
        // let canvasOutput = document.querySelector("#canvasOutput");
        ///process image.
        let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3); //create destination
        let dsize = new cv.Size(350, 350); //size
        cv.resize(src, src, dsize, 0, 0, cv.INTER_AREA);
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0); //make gray
        // let ksize = new cv.Size(3, 3);
        // cv.GaussianBlur(src, src, ksize, 0, 0, cv.BORDER_DEFAULT); //blur
        cv.Canny(src, dst, 250, 40, 3, false); //detect edges
        // for (let i = 0; i < dst.rows; ++i) {
        //   //change the colour of pixels to make more white space
        //   for (let j = 0; j < dst.cols; ++j) {
        //     if (
        //       (dst.ucharPtr(i, j)[0] == 0) &
        //         (dst.ucharPtr(i + 1, j)[0] == 255) ||
        //       (dst.ucharPtr(i, j)[0] == 0) &
        //         (dst.ucharPtr(i - 1, j)[0] == 255) ||
        //       (dst.ucharPtr(i, j)[0] == 0) & (dst.ucharPtr(i, j + 1)[0] == 255)
        //     ) {
        //       dst.ucharPtr(i, j)[0] = 0;
        //     }
        //   }
        // }

        let contours = new cv.MatVector(); //prep for contrours
        let hierarchy = new cv.Mat();
        cv.findContours(
          dst,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        );

        points = []; //extract points from countour
        for (let i = 0; i < contours.size(); ++i) {
          const ci = contours.get(i);
          for (let j = 0; j < ci.data32S.length; j += 2) {
            let p = {};
            p.x = ci.data32S[j];
            p.y = ci.data32S[j + 1];
            let probab = 0.8; //dont use all the points, we want a blind countour style drawing
            let rando = Math.random(1);
            if (rando < probab) {
              points.push(p);
            }
          }
        }
        //////draw to canvas and add to gcode string////
        pre();
        ctx6.fillStyle = "black";
        ctx6.rect(0, 0, 400, 400);
        ctx6.beginPath();
        let first = true;
        points.forEach((el) => {
          if (!first) {
            moveto(el.x, el.y);
            // first = false;
          } else {
            movetog1(el.x, el.y);
          }
          ctx6.lineTo(el.x, el.y); //change if need be
        });

        ctx6.closePath();
        ctx6.stroke();
        goup();
        foot();

        src.delete(); //delete source
        dst.delete(); //delete new matrix
        contours.delete();
        hierarchy.delete();

        //countours== Contours can be explained simply as a curve joining all the continuous points (along the boundary), having same color or intensity. The contours are a useful tool for shape analysis and object detection and recognition.
        // object to be found should be white and background should be black.
        //end of image stuff////

        ////////to display gcode to screen///////
        // document.getElementById("text2").innerHTML = gcode;
        //////////////
        //make gcode a gile thats downloadable gcode of draw to screen///
        const gcodefileURL = makegcodeTextFile(gcode); // CRLF
        let db = document.getElementById("download_btn2");
        db.setAttribute("href", gcodefileURL);
      };
      //////////////
      clearbtn.onclick = function () {
        ctx6.clearRect(0, 0, canvas6.width, canvas6.height);
      };

      function onOpenCvReady() {
        document.getElementById("status").innerHTML = "Lets get started!";
        console.log("cv", cv);
        // cv.onRuntimeInitialized = onReady;
      }

      //helper functions for gcode
      function goup() {
        return (gcode +=
          "M5 S90 \nG1 Z4.0000 F10000 \nG4 P0.20000000298023224\n");
      }
      function godown() {
        return (gcode += "M3 S90 \nG1 Z0 F10000\nG4 P0.20000000298023224\n");
      }

      function moveto(x, y) {
        x = x / 10.0;
        y = y / 10.0;
        return (gcode += "G0 X" + x + " Y" + y + " F10000" + "\n");
      }
      function movetog1(x, y) {
        x = x / 10.0;
        y = y / 10.0;
        return (gcode += "G1 X" + x + " Y" + y + " F10000" + "\n");
      }
      ////////////////////////////////////
      //////////////
      function pre() {
        gcode += "M3\n"; //RAISE PEN
        gcode += "G90\n";
        gcode += "G21\n";
        gcode += "G1 F10000\n";
      }
      function foot() {
        gcode += "M3 \n";
        gcode += "G4 P0.20000000298023224 \nG1 F10000\n";
        gcode += "G1 X0 Y0\n";
      }

      ///"M3 S90" to raise the pen
      ////////////

      ////////////////////////////////make file to download/////////////////////////
      let textFile = null;

      const makegcodeTextFile = (text) => {
        const data_file = new Blob([text], {
          type: "image/svg+xml;charset=utf-8",
        });
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data_file);
        return textFile;
      };

      ///////////////////////////////