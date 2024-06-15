const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinaryConfig");
const crypto = require("crypto");
const mailer = require("../utils/sendMailConfig");

const generateJwt = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists (parallel queries)
    const [userName, userEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (userName) {
      return res.status(400).json({
        message: "User with the username already exists. Try another username.",
      });
    }

    if (userEmail) {
      return res.status(400).json({
        message: "User with the email already exists. Try another email.",
      });
    }

    const bannerImg = [
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752762/banners/rumelxnrqxqw3xqfibjv.jpg",
        imgName: "Banner Image 1",
        imgId: "banner_img_1",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752757/banners/bd4ljls4skpvdqukga1m.jpg",
        imgName: "Banner Image 2",
        imgId: "banner_img_2",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752755/banners/gqwmj7n0vayf7nhjdxfk.jpg",
        imgName: "Banner Image 3",
        imgId: "banner_img_3",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752754/banners/ty6hxccdvsaq5oxgpdc0.jpg",
        imgName: "Banner Image 4",
        imgId: "banner_img_4",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752753/banners/mfryrl6ogrxqj9m5hr5s.jpg",
        imgName: "Banner Image 5",
        imgId: "banner_img_5",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752753/banners/nzj31j3lpn9zf6d4emjr.jpg",
        imgName: "Banner Image 6",
        imgId: "banner_img_6",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752753/banners/nzsyjkdabvrgetufgsjt.jpg",
        imgName: "Banner Image 7",
        imgId: "banner_img_7",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752753/banners/jibp5rfg46cs0vgszyts.jpg",
        imgName: "Banner Image 8",
        imgId: "banner_img_8",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752752/banners/krtd7r8c3rcnc3sf085y.jpg",
        imgName: "Banner Image 9",
        imgId: "banner_img_9",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752752/banners/avmn70pzbixfrwxk9ndn.jpg",
        imgName: "Banner Image 10",
        imgId: "banner_img_10",
      },
    ];

    const profileImg = [
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752761/profiles/tkytmwlikk5opl0mdqsp.jpg",
        imgName: "Profile Image 1",
        imgId: "profile_img_1",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752761/profiles/mj56mtoceqwmjp1ijtmj.jpg",
        imgName: "Profile Image 2",
        imgId: "profile_img_2",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752761/profiles/yq2yafktjskh0pxiek2z.jpg",
        imgName: "Profile Image 3",
        imgId: "profile_img_3",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752761/profiles/deyvxq1lbjjocmwxm7k8.jpg",
        imgName: "Profile Image 4",
        imgId: "profile_img_4",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752759/profiles/twpnyrbumjssxcyvnwfl.jpg",
        imgName: "Profile Image 5",
        imgId: "profile_img_5",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752758/profiles/y4zfictsmzfhsk9gpeu7.jpg",
        imgName: "Profile Image 6",
        imgId: "profile_img_6",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752758/profiles/stkxrm0cfjh4kvjaoubg.jpg",
        imgName: "Profile Image 7",
        imgId: "profile_img_7",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752757/profiles/cshxb5nllzlw0wcpcsog.jpg",
        imgName: "Profile Image 8",
        imgId: "profile_img_8",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752757/profiles/jrkypeb7xxnn1dq6ovyv.jpg",
        imgName: "Profile Image 9",
        imgId: "profile_img_9",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752756/profiles/mobd90fwxwo533rmadmh.jpg",
        imgName: "Profile Image 10",
        imgId: "profile_img_10",
      },
      {
        imgUrl:
          "https://res.cloudinary.com/dnmwhbb15/image/upload/v1716752756/profiles/kftgxuglthk0bkzcwoxr.jpg",
        imgName: "Profile Image 11",
        imgId: "profile_img_11",
      },
    ];

    const randomBannerIndex = Math.floor(Math.random() * bannerImg.length);
    const randomProfileIndex = Math.floor(Math.random() * profileImg.length);
    const randomBanner = bannerImg[randomBannerIndex];
    const randomProfile = profileImg[randomProfileIndex];

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      profileImage: {
        profileImgUrl: randomProfile.imgUrl,
        profileImgId: randomProfile.imgId,
        profileImgName: randomProfile.imgName,
      },
      bannerImage: {
        bannerImgUrl: randomBanner.imgUrl,
        bannerImgId: randomBanner.imgId,
        bannerImgName: randomBanner.imgName,
      },
    });

    await newUser.save();

    let subject = `Welcome ${username} ,We are happy to have you in the TOUKOU投稿`;
    let text = `Welcome ${username} to TOUKOU投稿`;
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1, h2 {
            color: #333;
          }
          p {
            color: #666;
          }
          .icon {
      display: inline-block;
      margin-bottom: 20px;
       display: flex;
        justify-content: center;
        align-items: center;
    }
    .icon svg {
       
      width: 45%;
      height: 45%;
    }
        </style>
      </head>
      <body>
        <div class="container">
         <h1>TOUKOU投稿</h1>
            <div class="icon">
<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" width="731.07696" height="629.61397" viewBox="0 0 731.07696 629.61397" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M538.56708,682.17352l7.98486-26.00457A87.77018,87.77018,0,0,0,511.468,632.66343c13.12443,21.74329.40684,50.10772,5.70644,74.94591a52.79386,52.79386,0,0,0,28.27717,35.97783l12.11706,15.0135a88.46588,88.46588,0,0,0,6.50218-73.78667,85.453,85.453,0,0,0-9.89442-19.0176C546.976,674.26143,538.56708,682.17352,538.56708,682.17352Z" transform="translate(-234.46152 -135.19301)" fill="#f2f2f2"/><path d="M494.66175,685.49609,490.211,658.6598a87.77019,87.77019,0,0,0-41.8846-5.39169c21.444,13.60792,22.71122,44.6671,38.53195,64.53481A52.79389,52.79389,0,0,0,528.213,737.39353l17.541,8.03374a88.4659,88.4659,0,0,0-27.08772-68.942,85.45282,85.45282,0,0,0-17.33741-12.60883C498.65942,674.66423,494.66175,685.49609,494.66175,685.49609Z" transform="translate(-234.46152 -135.19301)" fill="#f2f2f2"/><polygon points="521.537 616.734 509.237 616.733 503.386 569.293 521.539 569.294 521.537 616.734" fill="#ffb6b6"/><path d="M759.13479,763.849l-39.658-.00147v-.50161a15.43684,15.43684,0,0,1,15.436-15.43578h.001l7.24407-5.49573,13.51581,5.49657,3.46191.00014Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><polygon points="720.217 571.872 711.831 580.869 673.137 552.804 685.514 539.526 720.217 571.872" fill="#ffb6b6"/><path d="M965.53848,712.899l-27.04,29.01035-.36695-.342a15.43684,15.43684,0,0,1-.76756-21.81615l.00067-.00072.91868-9.0463,13.236-6.13976,2.36044-2.53242Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><path d="M936.47936,680.40333l-13,27.18935L843.6502,654.73756l-11.61334-15.82321-38.07879-51.88248-15.47871,24.56081-10.7705,25.675,0,0a28.302,28.302,0,0,0-12.67456,20.65424l-.4928,4.54552,6.80579,61.1824-25.86792,7.94283-14.85649-82.19011,4.85649-17.80989,5-25,25.17374-79h67.36433l38.6375,82.24219,2.82443,16.75781,10.95506,12.57265Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><path d="M796.48335,398.341l11.34,8.635,13.676,4.20263s5.65378,79.52834,10.74814,84.62269.49987,5.23128,1.52352,11.84916,3.51167,20.18377,3.51167,20.18377c-34.38706,18.20258-64.03232,18.69086-87.845-2.60925a5.93118,5.93118,0,0,1,3.23609-6.69462c4.43194-2.35163-4.08556-13.32756-.46361-15.16273s-1.4724-17.755-1.4724-17.755l3.34187-33.21557-2.64024-5.30956,6.44317-32.48859,11.18013-4.083,4.466-10.76026Z" transform="translate(-234.46152 -135.19301)" fill="#3f3d56"/><path d="M803.58728,539.68971a9.83035,9.83035,0,0,1,11.20736-10.08023l15.98166-31.06366,8.90389,15.81982L823.1387,541.4389a9.88361,9.88361,0,0,1-19.55136-1.74918Z" transform="translate(-234.46152 -135.19301)" fill="#ffb6b6"/><path d="M830.50168,532.09076l34.27838-53.12742-.11314-.24445c-.12943-.28006-7.89169-17.04459-15.413-32.39983-1.15826-2.36467-2.3108-4.69592-3.42888-6.92839q-.72381-1.44525-1.42606-2.83006c-3.159-6.22784-5.919-11.37528-7.56648-13.82041a29.01529,29.01529,0,0,0-15.37527-11.66364l-.15859-.04079-.15142.06313a14.72433,14.72433,0,0,0-8.76284,16.19752,104.29613,104.29613,0,0,0,19.35291,43.755l5.55705,7.32474-19.31154,41.98521Z" transform="translate(-234.46152 -135.19301)" fill="#3f3d56"/><path d="M712.62832,328.445a9.83033,9.83033,0,0,1-2.35881,14.888l7.14559,34.1951-16.87862-6.68267-4.19794-31.44773A9.88361,9.88361,0,0,1,712.62826,328.445Z" transform="translate(-234.46152 -135.19301)" fill="#ffb6b6"/><path d="M696.50521,351.29613l6.82551,62.85653.24182.11864c.19929.09793,8.84664,4.33935,19.46132,9.39061,1.79066.85212,1.534,4.54332,3.40548,5.42554,1.28913.60768,4.69342-1.59731,5.996-.98817,11.6023,5.42574,23.33421,10.70159,28.0098,12.13115a29.0153,29.0153,0,0,0,19.2887-.621l.14888-.06818.07788-.14439a14.72433,14.72433,0,0,0-3.39225-18.10082A104.29612,104.29612,0,0,0,733.98177,399.492l-8.92931-2.19087-11.4361-44.77621Z" transform="translate(-234.46152 -135.19301)" fill="#3f3d56"/><circle cx="549.93117" cy="237.15579" r="22.43078" fill="#ffb6b6"/><path d="M762.12254,357.31823c1.84464-5.36654,11.02745-9.08881,25.91417-9.60638S806.699,364.73761,806.699,364.73761c9.938,8.06173-10.61182,29.645-11.606,28.86767l.447-4.05508c.74029-6.71673,3.8855-11.95752-.1145-18.95752l-3.841.0441q-7.441,1.43086-14.882,2.8617l5.87292-5.17092-.16561-.25624a22.72645,22.72645,0,0,1-8.01666,2.43412c-3.15652.18554-6.60741-1.0707-8.11933-3.84781a6.46564,6.46564,0,0,1-.7254-2.46008c-4.25655,1.70064-6.203,6.94811-6.203,6.94811S760.2779,362.68477,762.12254,357.31823Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><path d="M324.835,358.66391a12.01539,12.01539,0,0,0-.98135-1.09867c.08535-.11731.1707-.2453.25605-.36261Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><path d="M329.19746,448.8796c-3.66922,6.51717-10.997,10.15436-18.26074,11.93562a45.62848,45.62848,0,0,1-24.82054-.47994c-1.02393-.33065-2.04792-.71469-3.03988-1.1413a26.19137,26.19137,0,0,0,1.13063-3.89323,26.70185,26.70185,0,0,0,.55467-5.45048,17.20675,17.20675,0,0,1-3.10394,4.27721,15.69464,15.69464,0,0,1-3.25321,2.61319,31.94711,31.94711,0,0,1-9.43967-8.76768c.15995-.39465.32-.7893.46932-1.18395a42.55225,42.55225,0,0,0,1.83457-6.33579,43.3241,43.3241,0,0,0,.90668-8.86371,27.85116,27.85116,0,0,1-5.05589,6.95439,22.66926,22.66926,0,0,1-1.94121,1.84532,25.52261,25.52261,0,0,1,1.53589-19.63673c4.22388-7.80776,12.41561-12.44758,19.7114-17.49273,7.3064-5.04521,14.61287-11.87162,15.23147-20.73533.416-5.98379-2.35721-11.97832-1.24794-17.86609a13.804,13.804,0,0,1,23.44455-7.09313c-4.13853,5.86648-8.25572,11.93562-9.93034,18.91137-1.70658,7.10381-.3093,15.4342,5.29052,20.138,1.91992,1.6213,4.2772,2.77328,5.75984,4.79984,1.97324,2.68794,1.98392,6.2718,2.3039,9.5784.63995,6.43176,2.74125,12.61821,3.87187,18.986C332.29072,436.33606,332.35471,443.23714,329.19746,448.8796Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><polygon points="19.519 578.195 29.254 585.716 62.898 551.747 48.53 540.646 19.519 578.195" fill="#a0616a"/><path d="M254.39467,706.03868l16.098,10.972-5.09439,6.593,6.8227,21.40865a5.20442,5.20442,0,0,1-8.14088,5.699l-18.32032-14.156,1.88135-8.9615-6.27209,5.56879-6.90749-5.3374Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><path d="M303.36907,377.61406a23.23609,23.23609,0,1,0,39.96608-16.11663l-.11153-.11142c-.1859-.19526-.3718-.39041-.567-.57636a.0091.0091,0,0,1-.00925-.00931c-.24166-.22305-.48333-.44611-.7343-.65987-4.08951-3.58763-9.83738-7.48171-15.70217-7.48171C313.37529,352.65876,303.36907,364.77839,303.36907,377.61406Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><path d="M435.81127,365.68143a8.51137,8.51137,0,0,1-9.217,9.24l-57.53844,51.95118-9.90168-15.63847,59.67194-46.14888a8.55747,8.55747,0,0,1,16.9852.59613Z" transform="translate(-234.46152 -135.19301)" fill="#a0616a"/><path d="M344.46482,442.55352s2.14082,3.954,9.45367-2.15133c5.85449-4.88778,33.90287-26.1074,39.94545-34.80272a6.68639,6.68639,0,0,0,7.8722-2.28582L385.17992,388.814c-4.95365.57025-4.84748,3.898-4.3316,5.78732l-12.48864,5.65825-32.24957,20.60975,6.75648,18.85359Z" transform="translate(-234.46152 -135.19301)" fill="#4c4c6d"/><polygon points="78.761 343.789 77.555 349.532 76.531 370.716 121.615 373.194 120.215 340.612 115.845 333.432 78.761 343.789" fill="#a0616a"/><circle cx="97.86833" cy="247.79721" r="19.48446" fill="#a0616a"/><path d="M297.7375,454.85772l-.11981-16.19628a25.77616,25.77616,0,0,1,19.96171-25.124l.07352-.01725,3.85281-5.19124,15.65329,1.56586,2.86907,5.86367,11.34257,6.7539,4.36706,14.03864a16.6021,16.6021,0,0,1,7.17414,11.11883c1.48266,9.47052-5.14824,18.94649-5.937,20.033l-2.03225,11.44559-44.21015,7.80056-.359.04538Z" transform="translate(-234.46152 -135.19301)" fill="#4c4c6d"/><path d="M356.17263,379.51655a66.42811,66.42811,0,0,1-7.06117,3.89317,40.63183,40.63183,0,0,1-7.70105,2.784,26.61691,26.61691,0,0,0-2.77322-4.72517,17.1841,17.1841,0,0,1,.02129,5.27977,27.50736,27.50736,0,0,1-13.13024-1.07724l-3.66921-6.15449-.27734,6.86911c-3.03987.55467-6.06914,1.07731-9.109,1.62131-.18131.02128-.36262.064-.53332.096-1.888-8.51171.7893-17.88745,6.74112-23.56187a21.445,21.445,0,0,1,22.52727-4.37323c.48.192.9706.40532,1.43992.62934a.01046.01046,0,0,0,.01068.01068c.27734.1386.512.46925.82133.43729C356.79123,359.7625,357.21791,370.08749,356.17263,379.51655Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><polygon points="89.297 553.071 99.047 560.572 132.623 526.535 118.233 515.464 89.297 553.071" fill="#a0616a"/><path d="M325.0419,681.59354,341.162,692.533l-5.08106,6.60328,6.86592,21.39482a5.20442,5.20442,0,0,1-8.12936,5.71539l-18.34887-14.119,1.86325-8.96528-6.26083,5.58145-6.91826-5.32344Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><path d="M292.1202,646.72233l-.00046-.12707,4.6209-7.9629-4.71847-10.36547-.14158-26.63073.76488-3.99777a33.63171,33.63171,0,0,0-.872-16.15848l0,0-.08618-16.21005c-.16577-4.06077,6.125-7.63227,4.658-11.01763-13.86622-31.999,14.15957-56.40982,14.34888-56.60574l.57273-.59543,3.10738,2.35356,2.95761.00363,39.9118,7.27258.28818.53734c1.5698,2.94445,4.59938,13.09349,4.7791,17.68625,1.98913,2.30273,24.647,28.52139,26.66114,30.34306,13.61081,12.31513,21.40353,32.69845,24.8372,43.75283a17.55469,17.55469,0,0,1-3.00617,16.14273L359.2765,671.58175l-13.86622-12.79958,27.88057-50.80511-2.01047-5.1546a15.843,15.843,0,0,1-9.2368-5.36609l-5.64564-6.70125a12.52908,12.52908,0,0,1-2.85958-6.517l-3.4237-.41208L337.85082,570.95l-8.5084,77.05214-2.31318,6.08677-40.28372,47.35855L269.6794,690.78113Z" transform="translate(-234.46152 -135.19301)" fill="#2f2e41"/><path d="M285.9682,315.86955a8.51136,8.51136,0,0,0,2.6234,12.78474l-12.80937,37.922,10.45957,40.18733,16.86612-7.62493-10.40771-30.31217,7.78662-44.12171a8.55747,8.55747,0,0,0-14.51863-8.83527Z" transform="translate(-234.46152 -135.19301)" fill="#a0616a"/><path d="M301.40665,439.87572s-3.96136,2.12717-6.71636-6.99219c-2.20557-7.30074-17.21552-46.94027-17.486-57.52555a6.68641,6.68641,0,0,1-5.32114-6.23555l21.80019-3.01683c3.82541,3.19846,1.90812,5.92043.43893,7.21547l7.425,12.5769,15.51936,33.95343L304.2974,438.38894Z" transform="translate(-234.46152 -135.19301)" fill="#4c4c6d"/><path d="M312.46831,388.00518A39.63376,39.63376,0,0,1,342.982,361.48812c.02785-.00919.12083-.0464.24166-.10211.07432-.04652.16729-.093.26022-.13944-.27883-.158-.54834-.29737-.82722-.43692a.0091.0091,0,0,1-.00925-.00931c-.24166-.22305-.48333-.44611-.7343-.65987l-.70638.02792S316.38129,356.23686,312.46831,388.00518Z" transform="translate(-234.46152 -135.19301)" fill="#fd6584"/><ellipse cx="624.31846" cy="599.48269" rx="8.8567" ry="10.19466" transform="translate(-455.07569 652.01793) rotate(-56.36398)" fill="#f2f2f2"/><ellipse cx="569.31846" cy="447.48269" rx="8.8567" ry="10.19466" transform="translate(-353.05924 538.42151) rotate(-56.36398)" fill="#f2f2f2"/><ellipse cx="799.31846" cy="681.48269" rx="8.8567" ry="10.19466" transform="translate(-445.28183 834.29719) rotate(-56.36398)" fill="#f2f2f2"/><ellipse cx="334.31846" cy="192.48269" rx="8.8567" ry="10.19466" transform="translate(-245.58303 229.01517) rotate(-56.36398)" fill="#f2f2f2"/><ellipse cx="551.31846" cy="144.48269" rx="8.8567" ry="10.19466" transform="translate(-108.8191 388.27147) rotate(-56.36398)" fill="#f2f2f2"/><ellipse cx="448.61817" cy="547.19724" rx="8.8567" ry="10.19466" transform="translate(-489.92146 482.41084) rotate(-56.36398)" fill="#e6e6e6"/><path d="M904.72873,764.807h-650.294a1.19069,1.19069,0,0,1,0-2.38137h650.294a1.19068,1.19068,0,0,1,0,2.38137Z" transform="translate(-234.46152 -135.19301)" fill="#ccc"/><path d="M375.47008,369.35489a22.24025,22.24025,0,0,1-22.04492-19.83057L340.72985,231.61758a22.23015,22.23015,0,0,1,19.70068-24.45508l376.9541-40.58789a22.23025,22.23025,0,0,1,24.45606,19.7002L774.536,304.18106a22.231,22.231,0,0,1-19.70117,24.45605l-.05372-.49707.05372.49707L377.88072,369.225A22.49378,22.49378,0,0,1,375.47008,369.35489Z" transform="translate(-234.46152 -135.19301)" fill="#e6e6e6"/><path d="M733.23277,172.04825a19.85228,19.85228,0,0,0-2.12011.11425L367.74938,211.287a19.4592,19.4592,0,0,0-17.26416,21.43066l6.41894,59.61475a73.81135,73.81135,0,0,0,81.28955,65.48632L693.6986,330.30752A73.58749,73.58749,0,0,0,758.9857,249.265l-6.44287-59.83838a19.4634,19.4634,0,0,0-19.31006-17.37841Z" transform="translate(-234.46152 -135.19301)" fill="#fff"/><path d="M656.71383,234.09012l-203.08846,21.8673a4.4443,4.4443,0,1,1-.95157-8.83751l203.08846-21.8673a4.4443,4.4443,0,1,1,.95157,8.83751Z" transform="translate(-234.46152 -135.19301)" fill="#4c4c6d"/><path d="M659.63425,261.213l-203.08846,21.8673a4.4443,4.4443,0,0,1-.95157-8.83752l203.08846-21.8673a4.4443,4.4443,0,0,1,.95157,8.83752Z" transform="translate(-234.46152 -135.19301)" fill="#4c4c6d"/><path d="M483.13313,307.65418l-23.667,2.54832a4.4443,4.4443,0,0,1-.95157-8.83752l23.667-2.54831a4.4443,4.4443,0,1,1,.95157,8.83751Z" transform="translate(-234.46152 -135.19301)" fill="#4c4c6d"/><circle cx="133.01784" cy="93.39967" r="8" fill="#3f3d56"/><circle cx="491.01784" cy="53.39967" r="8" fill="#3f3d56"/><path d="M617.3226,360.82948a6.58718,6.58718,0,0,1-2.23618-5.19571,87.65934,87.65934,0,0,0-5.62982-34.07665,6.58717,6.58717,0,0,1,.44621-5.63887,6.43872,6.43872,0,0,1,4.44875-3.1298c9.29859-5.61123,18.83092-7.18656,28.33811-4.68125a6.51458,6.51458,0,0,1,7.1633,4.49107,144.983,144.983,0,0,1,6.36475,38.52514,6.51419,6.51419,0,0,1-5.44589,6.57523l-28.13329,4.64791A6.43755,6.43755,0,0,1,617.3226,360.82948Z" transform="translate(-234.46152 -135.19301)" fill="#4c4c6d"/><path d="M619.82141,326.97378l23.679-3.912a1.5,1.5,0,1,0-.489-2.95987l-23.679,3.912a1.5,1.5,0,0,0,.489,2.95987Z" transform="translate(-234.46152 -135.19301)" fill="#fff"/><path d="M621.77741,338.81329l23.679-3.912a1.5,1.5,0,0,0-.489-2.95988l-23.679,3.912a1.5,1.5,0,1,0,.489,2.95987Z" transform="translate(-234.46152 -135.19301)" fill="#fff"/><path d="M623.73342,350.65281l23.679-3.912a1.5,1.5,0,0,0-.489-2.95988l-23.679,3.912a1.5,1.5,0,1,0,.489,2.95988Z" transform="translate(-234.46152 -135.19301)" fill="#fff"/></svg>
    </div>
          <h1>Welcome to TOUKOU投稿!</h1>
      <p>Dear ${username},</p>
      <p>Welcome to TOUKOU投稿! Ready to embark on this epic journey? Equip your keyboard, power up your monitors, and let's conquer the digital world together! Remember, with great power comes great responsibility – use it wisely, like a true anime protagonist.</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
       <h2> login, get verified ,post and enjoy the community</h2>
        </div>
      </body>
      </html>
    `;

    // Send email
    await mailer(email, subject, text, html);

    // Generate JWT token for the newly registered user
    const token = generateJwt(newUser._id);

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        profileImage: newUser.profileImage,
        bannerImage: newUser.bannerImage,
        username: newUser.username,
        email: newUser.email,
        verified: newUser.verified,
        isAdmin: newUser.isAdmin,
        superAdmin: newUser.superAdmin,
        bio: newUser.bio,
        noOfPosts: newUser.noOfPosts,
        createdAt: newUser.createdAt,
        achievements: newUser.achievements,
        sex: newUser.sex,
        token: token,
        banned: newUser.banned,
        banReason: newUser.banReason,
        softdeleted: newUser.deleted,
        softdeletionReason: newUser.deletionReason,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error); // Log the error details
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userInfo, password } = req.body;

    // Check if the provided credential matches a username or an email
    const user = await User.findOne({
      $or: [{ username: userInfo }, { email: userInfo }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with the provided credential does not exist." }); // Use 404 for not found
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    // Debugging log

    if (!passwordMatch) {
      return res.status(410).json({ message: "Incorrect password" }); // Use 401 for unauthorized
    } else {
      // If password matches, generate JWT token
      const token = generateJwt(user._id);

      // Respond with user data and token
      res.status(200).json({
        message: "User logged in successfully.",
        user: {
          _id: user._id,
          profileImage: user.profileImage,
          bannerImage: user.bannerImage,
          username: user.username,
          email: user.email,
          verified: user.verified,
          isAdmin: user.isAdmin,
          superAdmin: user.superAdmin,
          bio: user.bio,
          noOfPosts: user.noOfPosts,
          createdAt: user.createdAt,
          achievments: user.achievements,
          sex: user.sex,
          token: token,
          banned: user.banned,
          banReason: user.banReason,
          softdeleted: user.deleted,
          softdeletionReason: user.deletionReason,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getVerificationCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verifyCode = crypto.randomInt(100000, 1000000).toString();

    const verifyExpireDate = new Date(Date.now() + 60 * 60 * 1000);

    // Await bcrypt hash function
    const hashedVerifyCode = await bcrypt.hash(
      verifyCode,
      parseInt(process.env.SALT)
    );
    const verificationCode = hashedVerifyCode;

    if (user.verificationCode) {
      user.verificationCode = null;
      user.verificationCode = verificationCode;
    }
    user.VerifiedCodeExpireDate = verifyExpireDate;
    user.verificationCode = verificationCode;

    const userWithCode = await user.save();

    let email = user.email;
    let subject = `Verification Token for ${user.username}`;
    let text = `Your verification code is: ${verifyCode}`;
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;


          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1, h2 {
          color: #333;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
       <h1>TOUKOU投稿</h1>
        <h1>Your Verification Code</h1>
      <p>Dear ${user.username},</p>
      <p>Your verification code is <strong> ${verifyCode} <strong/>. Enter it faster than Goku can power up! Just kidding, you have some time, but not too much an hour to be precise(1h) – the Dragon Balls won't wait forever!</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
      </div>
    </body>
    </html>
    `;

    await mailer(email, subject, text, html);

    res.status(200).json({
      message: "Verification Code sent to your email.",
      verifytest: verifyCode,
      salt: parseInt(process.env.SALT),
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const userVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { verificationCode } = req.body;

    const verificationCheck = await bcrypt.compare(
      verificationCode,
      user.verificationCode
    );

    if (!verificationCheck) {
      return res.status(412).json({ message: "Incorrect verification code" });
    }

    if (new Date() > user.VerifiedCodeExpireDate) {
      return res.status(401).json({ message: "Verification code expired" });
    }

    if (user.verified) {
      return res.status(411).json({ message: "User already Verified" });
    }
    user.verified = true;
    user.VerifiedCodeExpireDate = null; // Use null for date fields
    user.verificationCode = ""; // Clear the verification code

    const token = generateJwt(user._id);

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    const email = user.email;
    const subject = "Account Verified!";
    const text = `Dear ${user.username},

Congratulations! Your account has been verified. You've unlocked the next level, just like beating a final boss. Now you're officially a part of our epic saga. Time to embark on new adventures!

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verified!</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1> TOUKOU投稿 <h1/>
      <h1>Account Verified!</h1>
      <p>Dear ${user.username},</p>
      <p>Congratulations! Your account has been verified. You've unlocked the next level, just like beating a final boss. Now you're officially a part of our epic saga. Time to embark on new adventures!</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);
    // Respond with a success message and updated user data
    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        username: updatedUserProfile.username,
        email: updatedUserProfile.email,
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        bannerImage: updatedUserProfile.bannerImage,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.isAdmin,
        superAdmin: updatedUserProfile.superAdmin,
        noOfPosts: updatedUserProfile.noOfPosts,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
        token: token,
        banned: updatedUserProfile.banned,
        banReason: updatedUserProfile.banReason,
        softDeleted: updatedUserProfile.deleted,
        softDeletionReason: updatedUserProfile.deletionReason,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const createOTPCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find and delete existing OTP for the user

    const existingOTP = await OTP.findOne({ userId: user._id });
    if (existingOTP) {
      await existingOTP.deleteOne();
    }

    const OTPCode = crypto.randomInt(100000, 1000000).toString();
    const OTPExpireDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const hashedOTPCode = await bcrypt.hash(
      OTPCode,
      parseInt(process.env.SALT)
    );

    // Create new OTP entry
    const newOTP = new OTP({
      userId: user._id,
      OTP: hashedOTPCode,
      OTPExpireDate: OTPExpireDate,
    });
    await newOTP.save();

    // Prepare email content
    let email = user.email;
    let subject = `OTP Token for ${user.username}`;
    let text = `Your OTP code is: ${OTPCode}`;
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1, h2 {
            color: #333;
          }
          p {
            color: #666;
          }
          .icon {
      display: inline-block;
      margin-bottom: 20px;
       display: flex;
        justify-content: center;
        align-items: center;
    }
    .icon svg {
       
      width: 45%;
      height: 45%;
    }
        </style>
      </head>
      <body>
        <div class="container">
            <div class="icon">
<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" width="561" height="493" viewBox="0 0 561 493" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M876.03027,689.45c-.98047,1.37-1.97021,2.73-2.95019,4.08A16.82838,16.82838,0,0,1,863.5,696.5h-527a16.90383,16.90383,0,0,1-9.21-2.72c-.91016-1.2-1.81006-2.41-2.72022-3.62006l.91016-.5L592.27,541.78a16.01919,16.01919,0,0,1,15.47021-.02L875.12988,688.95Z" transform="translate(-319.5 -203.5)" fill="#4c4c6d"/><path d="M863.5,378.5,632.28169,244.96964a64.023,64.023,0,0,0-63.98147-.03153L336.5,378.5a17.0241,17.0241,0,0,0-17,17v284a17.01984,17.01984,0,0,0,17,17h527a17.02879,17.02879,0,0,0,17-17v-284A17.02408,17.02408,0,0,0,863.5,378.5Zm15,301a15.03649,15.03649,0,0,1-15,15h-527a15.02706,15.02706,0,0,1-15-15v-284a15.01828,15.01828,0,0,1,15-15L568.30022,246.93811a64.023,64.023,0,0,1,63.98147.03153L863.5,380.5a15.01828,15.01828,0,0,1,15,15Z" transform="translate(-319.5 -203.5)" fill="#3f3d56"/><path d="M600.2998,539.18018a15.36345,15.36345,0,0,1-5.116-.8584l-.30249-.10694-.06128-.67236c-.18848.09277-.37866.18164-.56909.26563l-.20118.08837-.20141-.08886c-.42139-.18506-.83985-.39453-1.24365-.62207L408.5,433.73242V222.5A18.5208,18.5208,0,0,1,427,204H773a18.5208,18.5208,0,0,1,18.5,18.5V434.00244l-.25488.14356-183.25,103.04A15.75694,15.75694,0,0,1,600.2998,539.18018Z" transform="translate(-319.5 -203.5)" fill="#fff"/><path d="M600.2998,539.68018a15.85649,15.85649,0,0,1-5.282-.88672l-.60547-.21338-.02588-.28565-.33691.14795-.40234-.17676c-.43653-.19189-.86963-.40869-1.28784-.64453L408,434.02539V222.5a19.02154,19.02154,0,0,1,19-19H773a19.02162,19.02162,0,0,1,19,19V434.29492L608.24,537.62158A16.2527,16.2527,0,0,1,600.2998,539.68018Zm-4.01342-2.57666a14.49247,14.49247,0,0,0,10.97436-1.22559L790,433.125V222.5a17.01917,17.01917,0,0,0-17-17H427a17.01909,17.01909,0,0,0-17,17V432.85449l11.98962,6.7334,171.35047,96.29053q.34973.197.71.3706.36035-.17358.70923-.37011l1.34668-.75879Z" transform="translate(-319.5 -203.5)" fill="#3f3d56"/><path d="M876.06982,385.88,803.5,426.68,791,433.71,607.75,536.75a15.24213,15.24213,0,0,1-7.4502,1.93,14.91079,14.91079,0,0,1-4.9497-.83,12.05366,12.05366,0,0,1-1.3003-.5q-.61449-.27-1.1997-.6L421.5,440.46,409,433.44l-84.91992-47.72a1.011,1.011,0,0,1-.37988-1.37.99933.99933,0,0,1,1.35986-.38L409,431.14l12.5,7.02L593.83008,535a13.07441,13.07441,0,0,0,1.77978.83c.26026.1.53028.19.8003.27A13.26424,13.26424,0,0,0,606.77,535L791,431.42l12.5-7.03,71.58984-40.25a.99849.99849,0,1,1,.98,1.74Z" transform="translate(-319.5 -203.5)" fill="#3f3d56"/><path d="M483.5748,269.5h-28a8,8,0,0,1,0-16h28a8,8,0,0,1,0,16Z" transform="translate(-319.5 -203.5)" fill="#4c4c6d"/><path d="M516.5748,296.5h-61a8,8,0,0,1,0-16h61a8,8,0,0,1,0,16Z" transform="translate(-319.5 -203.5)" fill="#e6e6e6"/><path d="M687,368.5H514a8,8,0,0,1,0-16H687a8,8,0,0,1,0,16Z" transform="translate(-319.5 -203.5)" fill="#4c4c6d"/><path d="M703,399.5H497a8,8,0,0,1,0-16H703a8,8,0,0,1,0,16Z" transform="translate(-319.5 -203.5)" fill="#e6e6e6"/><path d="M703,429.5H497a8,8,0,0,1,0-16H703a8,8,0,0,1,0,16Z" transform="translate(-319.5 -203.5)" fill="#e6e6e6"/></svg>
   
    </div>
     <h1>TOUKOU投稿</h1>
            <h1>Your One-Time Password (OTP) Code</h1>
      <p>Dear ${user.username},</p>
      <p>Your one-time password (OTP) code is <strong> ${OTPCode} <strong/>. Use it quickly before it vanishes like a ninja in the night. Just remember, this code is more precious than a rare drop and only last an hour (1) – keep it safe!</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
        </div>
      </body>
      </html>
    `;

    // Send email
    await mailer(email, subject, text, html);

    res.status(200).json({
      message: "OTP Code sent to your email.",
      verifytest: OTPCode, // Should be `OTPCode` not `verifyCode`
      salt: parseInt(process.env.SALT),
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const verifyOTPCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const OTPEntry = await OTP.findOne({ userId: req.user._id });
    if (!OTPEntry) {
      return res.status(404).json({ message: "No OTP code found" });
    }

    const { OTPCode } = req.body;

    if (new Date() > OTPEntry.OTPExpireDate) {
      await OTPEntry.deleteOne();
      return res.status(401).json({ message: "OTP code has expired" });
    }

    const OTPCheck = await bcrypt.compare(OTPCode, OTPEntry.OTP);
    if (!OTPCheck) {
      await OTPEntry.deleteOne();
      return res.status(401).json({ message: "Incorrect OTP code" });
    }

    await OTPEntry.deleteOne();
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Set up pagination parameters
    const limit = parseInt(req.query.limit) || 10; // Number of users per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const skip = (page - 1) * limit;

    // Fetch users with pagination, excluding banned users, and retrieve specified fields
    const users = await User.find(
      { banned: false }, // Exclude users with the banned field set to true
      "_id username profileImage email noOfPosts verified achievements superAdmin isAdmin"
    )
      .skip(skip)
      .limit(limit);

    // Get total number of users for pagination metadata
    const totalUsers = await User.countDocuments({});
    const totalPages = Math.ceil(totalUsers / limit);

    // Organize the users in the desired format
    const organizedUsers = users.reduce((acc, user) => {
      acc[user._id] = {
        _id: user._id,
        isAdmin: user.isAdmin,
        superAdmin: user.superAdmin,
        username: user.username,
        profileImage: user.profileImage,
        bannerImage: user.bannerImage,
        email: user.email,
        noOfPosts: user.noOfPosts,
        verified: user.verified,
        banned: user.banned,
        noOfPosts: user.noOfPosts,
        achievements: user.achievements,
        bio: user.bio,
        createdAt: user.createdAt,
        sex: user.sex,
        banned: user.banned,
        banReason: user.banReason,
        softdeleted: user.deleted,
        softdeletionReason: user.deletionReason,
      };
      return acc;
    }, {});

    // Send the organized users along with pagination metadata as a response
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalUsers: totalUsers,
      users: organizedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        message: "User Found.",
        user: {
          _id: user._id,
          profileImage: user.profileImage,
          bannerImage: user.bannerImage,
          username: user.username,
          email: user.email,
          verified: user.verified,
          isAdmin: user.isAdmin,
          superAdmin: user.superAdmin,
          noOfPosts: user.noOfPosts,
          sex: user.sex,
          bio: user.bio,
          createdAt: user.createdAt,
          achievments: user.achievements,
          banned: user.banned,
          banReason: user.banReason,
          softdeleted: user.deleted,
          softdeletionReason: user.deletionReason,
        },
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error); // Pass the error to the error handling middleware
    }
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    let user = await User.findById(userId);

    if (user) {
      res.status(200).json({
        message: "User Found.",
        user: {
          _id: user._id,
          profileImage: user.profileImage,
          bannerImage: user.bannerImage,
          username: user.username,
          email: user.email,
          verified: user.verified,
          isAdmin: user.isAdmin,
          noOfPosts: user.noOfPosts,
          superAdmin: user.superAdmin,
          sex: user.sex,
          bio: user.bio,
          createdAt: user.createdAt,
          achievements: user.achievements,
          banned: user.banned,
          banReason: user.banReason,
          softdeleted: user.deleted,
          softdeletionReason: user.deletionReason,
        },
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error); // Pass the error to the error handling middleware
    }
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};
const getUserProfileByName = async (req, res, next) => {
  try {
    const { username } = req.body;

    let user = await User.findOne({ username: username });

    if (user) {
      res.status(200).json({
        message: "User Found.",
        user: {
          _id: user._id,
          profileImage: user.profileImage,
          bannerImage: user.bannerImage,
          username: user.username,
          email: user.email,
          verified: user.verified,
          admin: user.isAdmin,
          superAdmin: user.superAdmin,
          noOfPosts: user.noOfPosts,
          sex: user.sex,
          bio: user.bio,
          createdAt: user.createdAt,
          achievements: user.achievements,
          banned: user.banned,
          banReason: user.banReason,
          softdeleted: user.deleted,
          softdeletionReason: user.deletionReason,
        },
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new username already exists
    if (req.body.username && req.body.username !== user.username) {
      const existingUsername = await User.findOne({
        username: req.body.username,
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    // Check if the new email already exists
    if (req.body.email && req.body.email !== user.email) {
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already registered" });
      }
    }

    // Update user's profile fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.sex = req.body.sex || user.sex;
    user.bio = req.body.bio || user.bio;

    const token = generateJwt(user._id);
    // Save the updated user profile
    const updatedUserProfile = await user.save();

    const email = updatedUserProfile.email;
    const subject = "Profile Updated Successfully!";
    const text = `Dear ${updatedUserProfile.username},

Your profile has been updated! It's like upgrading your character stats or switching to a new avatar. Keep your details fresh and stay ahead in the game of life!

If you didn't make this change, please let us know immediately.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Updated Successfully!</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1> TOUKOU投稿 <h1/>
      <h1>Profile Updated Successfully!</h1>
      <p>Dear ${updatedUserProfile.username},</p>
      <p>Your profile has been updated! It's like upgrading your character stats or switching to a new avatar. Keep your details fresh and stay ahead in the game of life!</p>
      <p>If you didn't make this change, please let us know immediately.</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  
  `;

    await mailer(email, subject, text, html);
    // Respond with a success message and updated user data
    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        username: updatedUserProfile.username,
        email: updatedUserProfile.email,
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        bannerImage: updatedUserProfile.bannerImage,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.isAdmin,
        superAdmin: updatedUserProfile.superAdmin,
        noOfPosts: updatedUserProfile.noOfPosts,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
        token: token,
        banned: updatedUserProfile.banned,
        banReason: updatedUserProfile.banReason,
        softdeleted: updatedUserProfile.deleted,
        softdeletionReason: updatedUserProfile.deletionReason,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const uploadUserProfilePic = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imgFolder = `${user.username},${user._id},profile image`;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: imgFolder,
      crop: "scale",
      width: 250,
      quality: "auto",
      fetch_format: "auto",
    });

    if (!result) {
      return res.status(500).json({ message: "File upload failed" });
    }

    user.profileImage.profileImgUrl =
      result.secure_url || user.profileImage.profileImgUrl;
    user.profileImage.profileImgId =
      result.public_id || user.profileImage.profileImgId;
    user.profileImage.profileImgName =
      result.original_filename || user.profileImage.profileImgName;

    const token = generateJwt(user._id);
    // Save the updated user profile
    const updatedUserProfileImage = await user.save();

    res.status(200).json({
      message: "User profileImage updated successfully",
      user: {
        _id: user._id,
        profileImage: updatedUserProfileImage.profileImage,
        bannerImage: user.bannerImage,
        username: user.username,
        email: user.email,
        verified: user.verified,
        admin: user.isAdmin,
        noOfPosts: user.noOfPosts,
        superAdmin: user.superAdmin,
        sex: user.sex,
        bio: user.bio,
        token: token,
        banned: user.banned,
        banReason: user.banReason,
        softdeleted: user.deleted,
        softdeletionReason: user.deletionReason,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
const uploadUserBannerPic = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imgFolder = `${user.username},${user._id},banner image`;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: imgFolder,
      crop: "scale",
      width: 1000,
      quality: "auto",
      fetch_format: "auto",
    });

    if (!result) {
      return res.status(500).json({ message: "File upload failed" });
    }

    user.bannerImage.bannerImgUrl =
      result.secure_url || user.bannerImage.bannerImgUrl;
    user.bannerImage.bannerImgId =
      result.public_id || user.bannerImage.bannerImgId;
    user.bannerImage.bannerImgName =
      result.original_filename || user.bannerImage.bannerImgName;
    const token = generateJwt(user._id);
    // Save the updated user profile
    const updatedUserBannerImage = await user.save();

    res.status(200).json({
      message: "User bannerImage updated successfully",
      user: {
        _id: user._id,
        profileImage: user.profileImage,
        bannerImage: updatedUserBannerImage.bannerImage,
        username: user.username,
        email: user.email,
        verified: user.verified,
        admin: user.isAdmin,
        superAdmin: user.superAdmin,
        sex: user.sex,
        bio: user.bio,
        token: token,
        banned: user.banned,
        banReason: user.banReason,
        softdeleted: user.deleted,
        softdeletionReason: user.deletionReason,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    // Destructure the oldPassword, newPassword,   and OTPCode from the request body
    const { oldPassword, newPassword, OTPCode } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches the current password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(410).json({ message: "Incorrect password" });
    }

    // Check if the new password is the same as the current password
    const samePasswordMatch = await bcrypt.compare(newPassword, user.password);
    if (samePasswordMatch) {
      return res.status(401).json({ message: "Please change your password" });
    }

    // Check if the new password has been used previously
    const isOldPassword = await Promise.all(
      user.oldPassword.map(
        async (oldPwd) => await bcrypt.compare(newPassword, oldPwd)
      )
    ).then((results) => results.includes(true));

    if (isOldPassword) {
      return res
        .status(401)
        .json({ message: "Cannot use an already used password" });
    }

    // Find the OTP entry
    const OTPEntry = await OTP.findOne({ userId: req.user._id });
    if (!OTPEntry) {
      return res.status(404).json({ message: "No OTP code found" });
    }

    // Check if the OTP has expired
    if (new Date() > OTPEntry.OTPExpireDate) {
      await OTPEntry.deleteOne();
      return res.status(412).json({ message: "OTP code has expired" });
    }

    // Check if the provided OTP code matches
    const OTPCheck = await bcrypt.compare(OTPCode, OTPEntry.OTP);
    if (!OTPCheck) {
      await OTPEntry.deleteOne();
      return res.status(401).json({ message: "Incorrect OTP code" });
    }

    // Set the new password (this will be hashed by the pre-save hook)
    user.oldPassword.push(user.password); // Save the current password to the oldPassword array
    user.password = newPassword; // The new password will be hashed in the pre-save hook

    // Delete the OTP entry after successful OTP check
    await OTPEntry.deleteOne();

    // Generate a new JWT token
    const token = generateJwt(user._id);

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    const email = user.email;
    const subject = "Password Change Notice";
    const text = `Dear ${user.username},

Your password has been successfully changed. It's like upgrading your armor in an RPG – more security for your epic quests. If you didn't make this change, please contact our support team immediately.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Change Notice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1> TOUKOU投稿 <h1/>
      <h1>Password Change Notice</h1>
      <p>Dear ${user.username},</p>
      <p>Your password has been successfully changed. It's like upgrading your armor in an RPG – more security for your epic quests. If you didn't make this change, please contact our support team immediately.</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);
    // Respond with a success message
    res.status(200).json({
      message: "Password updated successfully",
      user: {
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        bannerImage: updatedUserProfile.bannerImage,
        username: updatedUserProfile.username,
        email: updatedUserProfile.email,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.isAdmin,
        superAdmin: updatedUserProfile.superAdmin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
        token: token,
        banned: updatedUserProfile.banned,
        banReason: updatedUserProfile.banReason,
        softdeleted: updatedUserProfile.deleted,
        softdeletionReason: updatedUserProfile.deletionReason,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const forgotPasswordOTP = async (req, res) => {
  try {
    const { userInfo } = req.body;

    // Check if the provided credential matches a username or an email
    const user = await User.findOne({
      $or: [{ username: userInfo }, { email: userInfo }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User with the provided credential does not exist.",
      });
    }

    // Find and delete existing OTP for the user
    const existingOTP = await OTP.findOne({ userId: user._id });
    if (existingOTP) {
      await existingOTP.deleteOne();
    }

    // Generate a new OTP
    const OTPCode = crypto.randomInt(100000, 1000000).toString();
    const OTPExpireDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const hashedOTPCode = await bcrypt.hash(
      OTPCode,
      parseInt(process.env.SALT)
    );

    // Create new OTP entry
    const newOTP = new OTP({
      userId: user._id,
      OTP: hashedOTPCode,
      OTPExpireDate: OTPExpireDate,
    });
    await newOTP.save();

    // Prepare email content
    const email = user.email;
    const subject = `OTP Token for ${user.username}`;
    const text = `Your OTP code is: ${OTPCode}`;
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1, h2 {
            color: #333;
          }
          p {
            color: #666;
          }
          .icon {
            display: inline-block;
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .icon svg {
            width: 45%;
            height: 45%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">
            <!-- SVG icon here -->
          </div>
          <h1>TOUKOU投稿</h1>
          <h1>Your One-Time Password (OTP) Code</h1>
          <p>Dear ${user.username},</p>
          <p>Your one-time password (OTP) code is <strong>${OTPCode}</strong>. Use it quickly before it vanishes like a ninja in the night. Just remember, this code is more precious than a rare drop and only lasts an hour – keep it safe!</p>
          <p>Best regards,</p>
          <p>The TOUKOU投稿 Team</p>
        </div>
      </body>
      </html>
    `;

    // Send email
    await mailer(email, subject, text, html);

    res.status(200).json({
      message: "OTP Code sent to your email.",
      verifytest: OTPCode, // Should be `OTPCode` not `verifyCode`
      salt: parseInt(process.env.SALT),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message }); // Ensure `next` is available in your Express setup
  }
};

const forgotPassword = async (req, res) => {
  try {
    // Destructure newPassword, OTPCode, and userInfo from the request body
    const { newPassword, OTPCode, userInfo } = req.body;

   const user = await User.findOne({
     $or: [{ username: userInfo }, { email: userInfo }],
   });

   // Handle case where user is not found
   if (!user) {
     return res.status(404).json({
       message: "User with the provided credential does not exist." ,
     
     });
   }

    // Check if the new password is the same as the current password
    const samePasswordMatch = await bcrypt.compare(newPassword, user.password);
    if (samePasswordMatch) {
      return res.status(401).json({ message: "Please change your password" });
    }

    // Check if the new password has been used previously
    const isOldPassword = await Promise.all(
      user.oldPassword.map(
        async (oldPwd) => await bcrypt.compare(newPassword, oldPwd)
      )
    ).then((results) => results.includes(true));

    if (isOldPassword) {
      return res
        .status(401)
        .json({ message: "Cannot use an already used password" });
    }

    // Find the OTP entry using user ID
    const OTPEntry = await OTP.findOne({ userId: user._id });
    if (!OTPEntry) {
      return res.status(404).json({ message: "No OTP code found" });
    }

    // Check if the OTP has expired
    if (new Date() > OTPEntry.OTPExpireDate) {
      await OTPEntry.deleteOne();
      return res.status(412).json({ message: "OTP code has expired" });
    }

    // Check if the provided OTP code matches
    const OTPCheck = await bcrypt.compare(OTPCode, OTPEntry.OTP);
    if (!OTPCheck) {
      await OTPEntry.deleteOne();
      return res.status(401).json({ message: "Incorrect OTP code" });
    }

    // Set the new password and update oldPassword array
    user.oldPassword.push(user.password); // Save the current password to the oldPassword array
    user.password = newPassword; // The new password will be hashed in the pre-save hook

    // Delete the OTP entry after successful OTP check
    await OTPEntry.deleteOne();

    // Generate a new JWT token
    const token = generateJwt(user._id);

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    // Prepare email content
    const email = user.email;
    const subject = "Password Change Notice";
    const text = `Dear ${user.username},

Your password has been successfully changed. It's like upgrading your armor in an RPG – more security for your epic quests. If you didn't make this change, please contact our support team immediately.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Change Notice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>TOUKOU投稿</h1>
      <h1>Password Change Notice</h1>
      <p>Dear ${user.username},</p>
      <p>Your password has been successfully changed. It's like upgrading your armor in an RPG – more security for your epic quests. If you didn't make this change, please contact our support team immediately.</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    // Send email notification
    await mailer(email, subject, text, html);

    // Respond with a success message
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message }); // Ensure proper error handling
  }
};

const SoftDelete = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Destructure the password and delete reason from the request body
    const { password, deleteReason } = req.body;

    // Check if deleteReason is provided
    if (!deleteReason) {
      return res
        .status(400)
        .json({ message: "Soft Delete reason is required" });
    }

    // Check if the provided password matches the current password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Mark the user as deleted and set the deletion reason
    user.deleted = true;
    user.deletionReason = deleteReason;

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    const email = user.email;
    const subject = "Account Soft Deletion Notice";
    const text = `Dear ${user.username},

Your account has been marked for deletion. for the reason:${deleteReason} 

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Soft Deletion Notice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
    <h1>TOUKOU投稿</h1>
       <h1>Account Soft Deletion Notice</h1>
      <p>Dear ${user.username},</p>
      <p>Your account has been disabled. Don't worry, it's not the end of the world – more like being trapped in the Hyperbolic Time Chamber. You have 30 days to restore your account by logging back in.</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);
    // Respond with a success message
    res.status(200).json({
      message: "User soft deleted successfully",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const unSoftDelete = async (req, res) => {
  try {
    const { password, userInfo } = req.body;
    // Find the user by ID
    const user = await User.findOne({
      $or: [{ username: userInfo }, { email: userInfo }],
    });

    if (!user) {
      console.log("no user");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("user found");
    // Check if the provided password matches the current password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    if (!user.deleted) {
      return res.status(405).json({ message: "user is not disabled" });
    }

    // Unmark the user as deleted and clear the deletion reason
    user.deleted = false;
    user.deletionReason = "";
    const token = generateJwt(user._id);

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    const email = user.email;
    const subject = "Account Re-enabled Notice";
    const text = `Dear ${user.username},

Your account has been successfully restored and is now active again.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Re-enabled Notice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1> TOUKOU投稿 <h1/>
    <h1>The TOUKOU投稿 Team</h1>
     
    <h1>Account Re-enabled Notice</h1>
      <p>Dear ${user.username},</p>
      <p>Congratulations! You've successfully escaped the Hyperbolic Time Chamber. Your account has been restored and is now active again. Welcome back to the digital battlefield!</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);
    // Respond with a success message
    res.status(200).json({
      message: "User restored successfully",
      user: {
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        bannerImage: updatedUserProfile.bannerImage,
        username: updatedUserProfile.username,
        email: updatedUserProfile.email,
        verified: updatedUserProfile.verified,
        isAdmin: updatedUserProfile.isAdmin,
        superAdmin: updatedUserProfile.superAdmin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
        token: token,
        banned: updatedUserProfile.banned,
        banReason: updatedUserProfile.banReason,
        softdeleted: updatedUserProfile.deleted,
        softdeletionReason: updatedUserProfile.deletionReason,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
    // Pass the error to the error handling middleware
  }
};

const banUser = async (req, res, next) => {
  try {
    const { username, banReason, banDuration } = req.body;

    // Find the user performing the ban action (the admin)
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Ensure only admins can perform the action
    if (!admin.isAdmin && !admin.superAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find the user to be banned
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the admin is trying to ban themselves
    if (user._id.equals(admin._id)) {
      return res.status(400).json({ message: "Cannot ban yourself" });
    }

    // Check if the user performing the ban action is a super admin
    if (admin.superAdmin) {
      // Super admins cannot ban other super admins
      if (user.superAdmin) {
        return res.status(403).json({ message: "Cannot ban a super admin" });
      }
    } else if (admin.isAdmin) {
      // Regular admins cannot ban other admins or super admins
      if (user.isAdmin || user.superAdmin) {
        return res
          .status(403)
          .json({ message: "Admins can only ban regular users" });
      }
    }

    // Ensure ban reason is provided
    if (!banReason) {
      return res.status(400).json({ message: "Ban reason is required" });
    }

    // Validate ban duration
    const validDurations = ["1h", "1d", "1w", "1m", "indefinite"];
    if (!banDuration || !validDurations.includes(banDuration)) {
      return res.status(400).json({
        message:
          "Valid ban duration is required: '1h', '1d', '1w', '1m', 'indefinite'",
      });
    }

    // Calculate the ban expiration date based on the duration preset
    let banExpiration = null;
    if (banDuration !== "indefinite") {
      banExpiration = new Date();
      switch (banDuration) {
        case "1h":
          banExpiration.setHours(banExpiration.getHours() + 1);
          break;
        case "1d":
          banExpiration.setDate(banExpiration.getDate() + 1);
          break;
        case "1w":
          banExpiration.setDate(banExpiration.getDate() + 7);
          break;
        case "1m":
          banExpiration.setMonth(banExpiration.getMonth() + 1);
          break;
      }
    }

    // Update the user document with ban details
    user.banned = true;
    user.banReason = banReason;
    user.banExpiration = banExpiration;

    await user.save();

    const email = user.email;
    const subject = "Account Ban Notice";
    const banEndDate = banExpiration
      ? banExpiration.toLocaleString("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        })
      : "indefinite";

    const text = `Dear ${user.username},

Your account has been banned until ${banEndDate} due to violations of our terms of service. If you believe this is a mistake, please contact our support team. This ban was issued by ${admin.username}.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Ban Notice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1>TOUKOU投稿</h1>
      <h1>Account Ban Notice</h1>
      <p>Dear ${user.username},</p>
      <p>You've been banned until ${banEndDate} for :${banReason}. Think of this as a timeout in the Shadow Realm. If you believe this is a mistake, please contact our support team. This ban was issued by ${admin.username}. Don't worry, even the best heroes face challenges.</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);

    res.status(200).json({
      message: "User banned successfully",
      banExpiration: user.banExpiration,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const getBannedUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Query the banned users
    const bannedUsers = await User.find({ banned: true })
      .skip(skip)
      .limit(limitNumber)
      .select("-password"); // Exclude sensitive information such as password

    // Get the total count of banned users
    const totalBannedUsers = await User.countDocuments({ banned: true });

    // Calculate total pages
    const totalPages = Math.ceil(totalBannedUsers / limitNumber);

    res.status(200).json({
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalBannedUsers,
      users: bannedUsers,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const unbanUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    // Find the user performing the unban action (the admin)
    let admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Ensure only admins can perform the action
    if (!admin.isAdmin && !admin.superAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find the user to be unbanned
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user performing the unban action is a super admin
    if (admin.superAdmin) {
      // Super admins can unban any user
    } else if (admin.isAdmin) {
      // Regular admins cannot unban other admins or super admins
      if (user.isAdmin || user.superAdmin) {
        return res
          .status(403)
          .json({ message: "Admins can only unban regular users" });
      }
    }

    // Check if the user is banned
    if (!user.banned) {
      return res.status(400).json({ message: "User is not banned" });
    }

    // Update the user document to unban the user
    user.banned = false;
    user.banReason = null;
    user.banExpiration = null;

    await user.save();

    const email = user.email;
    const subject = "Account Unban Notice";
    const text = `Dear ${user.username},

Your account ban has been lifted and your account is now active again.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Unban Notice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1> TOUKOU投稿 <h1/>
      <h1>Account Unban Notice</h1>
      <p>Dear ${user.username},</p>
      <p>Your account ban has been lifted and your account is now active again.</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);

    res.status(200).json({
      message: "User unbanned successfully",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const permadelete = async (req, res, next) => {
  try {
    // Find the authenticated user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches the user's password
    const { password } = req.body;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Remove the user from the database
    await User.deleteOne({ _id: req.user._id });

    const email = user.email;
    const subject = "Account Deletion Confirmation";
    const text = `Dear ${user.username},

Your account has been successfully deleted at your request. We're sorry to see you go. If you change your mind, you're always welcome to create a new account.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deletion Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1> TOUKOU投稿 <h1/>
      <h1>Farewell, Adventurer!</h1>
      <p>Dear ${user.username},</p>
      <p>We’re sad to see you go! Your account has been successfully deleted. If you ever want to return, you can always respawn in our world.</p>
      <p>Best of luck on your next adventure!</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);
    // Respond with a success message
    res.status(200).json({
      message: "User deleted permanently",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const makeAdmin = async (req, res, next) => {
  try {
    const { username } = req.body;
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.equals(admin._id)) {
      return res.status(400).json({ message: "Cannot promote yourself" });
    }

    if (user.isAdmin) {
      return res.status(403).json({ message: "User is already an admin" });
    }

    user.isAdmin = true;
    await user.save();

    const email = user.email;
    const subject = "Promotion to Admin";
    const text = `Dear ${user.username},

Congratulations! You have been promoted to an admin role. Thank you for your dedication and contribution.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promotion to Admin</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1> TOUKOU投稿 <h1/>
       <h1>Promotion to Admin</h1>
      <p>Dear ${user.username},</p>
      <p>Congratulations! You've been promoted to admin! Think of it as leveling up to Super Saiyan. Thank you for your dedication and contribution. Let's protect this community like our very own digital Konoha!</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);

    res.status(200).json({
      message: "User promoted to admin successfully",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const demoteAdmin = async (req, res, next) => {
  try {
    const { username } = req.body;
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.equals(admin._id)) {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ message: "User is already not an  admin" });
    }

    user.isAdmin = false;
    await user.save();
    const email = user.email;
    const subject = "Demotion from Admin";
    const text = `Dear ${user.username},

You have been demoted from your admin role. If you have any questions, please contact our support team.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demotion from Admin</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
     <h1> TOUKOU投稿 <h1/>
      <h1>Demotion from Admin</h1>
       <p>Dear ${user.username},</p>
      <p>You've been demoted from your admin role. It's not game over – more like losing a life in Super Mario. If you have any questions, please contact our support team. Let's work together to get back to the top!</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);

    res.status(200).json({
      message: "User demoted from admin successfully",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};
const permanentlyDeleteUserBySupAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { username } = req.params;

    // Find the user to be deleted
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the admin is not trying to delete themselves
    if (user._id.equals(admin._id)) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    // Remove the user from the database
    await User.deleteOne({ _id: user._id });
    const email = user.email;
    const subject = "Account Deletion Notice";
    const text = `Dear ${user.username},

Your account has been permanently deleted by an administrator due to violations of our terms of service. If you believe this is a mistake, please contact our support team. This action was taken by ${deletedBy}.

Best regards,
The TOUKOU投稿 Team`;

    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deletion Notice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, p {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
    <h1> TOUKOU投稿 <h1/>
       <h1>Account Deletion by Admin</h1>
      <p>Dear ${user.username},</p>
      <p>Your account has been deleted by an admin due to a breach of our community guidelines. If you believe this was a mistake, please contact support.</p>
      <p>May the code be with you!</p>
      <p>Best regards,</p>
      <p>The TOUKOU投稿 Team</p>
    </div>
  </body>
  </html>
  `;

    await mailer(email, subject, text, html);
    // Respond with a success message
    res.status(200).json({
      message: "User deleted permanently",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

module.exports = {
  registerUser,

  loginUser,
  getVerificationCode,
  userVerification,
  createOTPCode,
  verifyOTPCode,
  forgotPasswordOTP,
  forgotPassword,
  getAllUsers,
  getProfile,
  getUserProfile,
  getUserProfileByName,
  updateProfile,
  uploadUserProfilePic,
  uploadUserBannerPic,
  changePassword,
  unSoftDelete,
  SoftDelete,
  banUser,
  getBannedUsers,
  unbanUser,
  permadelete,
  makeAdmin,
  demoteAdmin,
  permanentlyDeleteUserBySupAdmin,
};
