var CvsDev = new CvsMotor;

/*var txt = "Specify the access level of this member (private, package-private, public, or protected). Specify the access level of this member (private, options. jsonParams. all_params[0] .sprite. width = options. jsonParams. result_variant [randNumberResult]. widthFrame; package-private, public, or protected). Specify the access level of this member (private, options. jsonParams. all_params[0] .sprite. width = options. jsonParams. result_variant [randNumberResult]. widthFrame; package-private, public, or protected). Specify the access level of this member (private, package-private, options. jsonParams. all_params[0] .sprite. width = options. jsonParams. result_variant [randNumberResult]. widthFrame; public, or protected). Specify the access level of this member (private, package-private, public, or protected).";*/

var txt = "Specify the access level of<br> this member (private, package-private, public, or protected).";

var lstImg = {
    bg: "img/bg.png",
    ava: "img/ava.jpg",
    heart: "img/heart.png",
    tired: "img/tired.png"
};

var hiddenCvs = document.createElement("canvas");
hiddenCvs.height = 368;
hiddenCvs.width = 700;

CvsDev.getTextHeight(txt);
CvsDev.init("testing");

CvsDev.addImages(lstImg, function () {
    CvsDev.imageDraw(
        CvsDev.getImages("bg"),
        {
            opacity: 1
        }
    );

    CvsDev.textDraw(txt, {
        font: "normal 700 20px/24px Arial, sans-serif",
        textShadow: "1px 1px 3px #0f0"
    });




    /*CvsDev.animate(function () {
        if (200 === CvsDev._inc) {
            CvsDev.stop = true;
        }
        CvsDev._ctx.clearRect(
            0, 0,
            700, 368
        );

        CvsDev.imageDraw(
            CvsDev.getImages("bg"),
            {
                width: 200,
                height: 200,
                left: CvsDev._inc,
                top: 100,

                //view: "circle",
                opacity: .5,
                strokeColor: "#00f",
                strokeWidth: 1,
                //filter: "negative" // negative, sepia, grayscale, threshold
            }
        );

        CvsDev.textDraw(txt, {
            //textShadow: "1px 1px 3px #0f0",

            font: "normal 700 20px/24px Arial, sans-serif",
            //top: 10,
            //textAlign: "center", // left, center, right,
            //view: "stroke", // fill, stroke
            left: CvsDev._inc * .5,
            top: 100,

            width: 500


        });




        /!*CvsDev._ctx.clearRect(
         0, 0,
         700, 368
         );

         CvsDev.textDraw(txt, {
         //textShadow: "1px 1px 3px #0f0",

         font: "normal 700 20px/24px Arial, sans-serif",
         //top: 10,
         //textAlign: "center", // left, center, right,
         //view: "stroke", // fill, stroke
         left: CvsDev._inc,

         stokeWidth: 1,

         width: 500


         });*!/

        /!*CvsDev._ctx.clearRect(
            CvsDev._inc - 2, 100,
            200, 200
        );*!/

        /!*CvsDev.imageDraw(
            CvsDev.getImages("bg"),
            {
                width: 200,
                height: 200,
                left: CvsDev._inc,
                top: 100,

                //view: "circle",
                opacity: .5,
                strokeColor: "#00f",
                strokeWidth: 1,
                //filter: "negative" // negative, sepia, grayscale, threshold
            }
        );*!/
    });*/
});






