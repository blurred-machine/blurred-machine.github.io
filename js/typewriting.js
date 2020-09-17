var typing_title = document.getElementById('typing_title');

var title_typewriter = new Typewriter(typing_title, {
    loop: false,
    cursor:""
});

var title_text = "PARAS VARSHNEY"
title_typewriter.typeString(title_text)
    .callFunction(end_typing_title)
    .start();

function end_typing_title(){
title_typewriter.stop();
console.log("Title typing ends here")
typing_title.innerHTML = title_text
}

// this is a break////////////////////////////////////////////////////////
// var i = 0;
// var txt = 'PARAS VARSHNEY';
// var speed = 210;

// function typeWriter() {
//   if (i < txt.length) {
//     document.getElementById("typing_title").innerHTML += txt.charAt(i);
//     i++;
//     setTimeout(typeWriter, speed);
//   }
// }

// this is a break////////////////////////////////////////////////////////

var typing_description = document.getElementById('typing_description');

var description_typewriter = new Typewriter(typing_description, {
    loop: true,
    delay: 80,
    autoStart: true,
    deleteSpeed: 5
});

description_typewriter.typeString('Hello World!')
    .pauseFor(1200)
    .deleteAll()

    .typeString("I'm a <strong>Data Scientist at IISc</strong>")
    .pauseFor(1500)
    .deleteChars(22)

    .typeString("<strong>Global Data Science Ambassador @ HP</strong> & <strong>NVIDIA</strong>")
    .pauseFor(1500)
    .deleteChars(45)

    .typeString("<strong>Kaggle Master</strong>")
    .pauseFor(1500)
    .deleteChars(15)

    .typeString("an Author @ <strong>Towards Data Science</strong>")
    .pauseFor(1500)
    // .deleteChars(31)
    .deleteAll()
    .start();



// this is a break////////////////////////////////////////////////////////    main

// var typing_about_main = document.getElementById('typing_about_main');

// var about_main_typewriter = new Typewriter(typing_about_main, {
//     loop: false,
//     delay: 0.1,
// });

// var about_main_text = "Paras Varshney is a Data Scientist at IUDX Programme Unit, Society of Innovation and Technology(SID), IISc Banglore, where he is working on the Research & Development for building data exchange platform for smart cities. Paras has recently received his Bachelor's degree in Computer Science from the Indian Institute of Information Technology. At Kaggle, Paras has achieved a Master tier with 2 gold and 12 silver medals with the highest world ranking as 186 out of 138,000+ data scientists. He also loves writing and his works are published Towards Data Science(TDS). Apart from that, he also helps junior coders develop programming skills through an online collaborative-based classroom environment. Not only the tech stuff, paras love to play guitar and drums and also do speedcubing. He has represented in state-level Table Tennis in UP and played a few zonals. Paras loves traveling and exploring new things."

// about_main_typewriter.typeString(about_main_text)
//     .callFunction(end_typing_about, about_main_typewriter)
//     .start();

// function end_typing_about(){
// about_main_typewriter.stop();
// console.log("About typing ends here")
// typing_about_main.innerHTML = about_main_text
// }



// this is a break////////////////////////////////////////////////////////    C1

// var typing_about_c1 = document.getElementById('typing_about_c1');

// var about_c1_typewriter = new Typewriter(typing_about_c1, {
//     loop: false,
//     delay: 2,
// });

// var about_c1_text= "Since I was a kid👦, becoming a scientist👨‍🔬 has been my dream. I used to experiment🥼 with things a lot and bring out some amazing observations📜 out of them. I still remember when I was a kid I used to open up gadgets⚙️ to make something new out of them."

// about_c1_typewriter.typeString(about_c1_text)
//     .callFunction(end_typing_about, about_c1_typewriter)
//     .start();

// function end_typing_about(){
// about_c1_typewriter.stop();
// console.log("About c1 typing ends here")
// typing_about_c1.innerHTML = about_c1_text
// }




// this is a break////////////////////////////////////////////////////////    C2

// var typing_about_c2 = document.getElementById('typing_about_c2');

// var about_c2_typewriter = new Typewriter(typing_about_c2, {
//     loop: false,
//     delay: 2,
// });

// var about_c2_text= "This passion brought me to study at IIITK🏫, where we give huge importance to design💡 thinking🤔💭 and creativity🖊️.With all the resources available I learned programming🖥️, higher mathematics📈, algorithms👨‍💻 and the art of machine learning🤖 where I used to experiment with data📊 and code to make something new every day."

// about_c2_typewriter.typeString(about_c2_text)
//     .callFunction(end_typing_about, about_c2_typewriter)
//     .start();

// function end_typing_about(){
// about_c2_typewriter.stop();
// console.log("About c2 typing ends here")
// typing_about_c2.innerHTML = about_c2_text
// }




// this is a break////////////////////////////////////////////////////////    C3

// var typing_about_c3 = document.getElementById('typing_about_c3');

// var about_main_typewriter = new Typewriter(typing_about_c3, {
//     loop: false,
//     delay: 2,
// });

// var about_c3_text= "In my professional career👨‍💼, this passion stays with me all the time and brought to me the dedication to achieve🎯 what I am looking for. This being the tip of an iceberg🏔️, there is still a long way to go and learn📖 from each step in life. I wish to follow this passion for my entire life."

// about_main_typewriter.typeString(about_c3_text)
//     .callFunction(end_typing_about, about_main_typewriter)
//     .start();

// function end_typing_about(){
// about_main_typewriter.stop();
// console.log("About c3 typing ends here")
// typing_about_c3.innerHTML = about_c3_text
// }
