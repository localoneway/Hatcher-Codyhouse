function sendMail(params){
  var tempParams ={
    firstName:document.getElementById("firstName").value,
    inputEmail:document.getElementById("inputEmail").value,
    companyName:document.getElementById("companyName").value,
    textarea:document.getElementById("textarea").value,
  };

  emailjs.send('gmail', 'Hatcher Contact', 'tempParams')
  .then(function(res){
    console.log("success", res.status);
  })

}
