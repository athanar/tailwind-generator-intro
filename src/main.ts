

import {openai} from './openAI';

const form = document.querySelector('#generated-form') as HTMLFormElement;
const iframe = document.querySelector('#generated-code') as HTMLIFrameElement;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const prompt = formData.get('prompt') as string;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 1,
    top_p:1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    messages: [
      { role: "system", 
        content: "Tu crées des sites web avec tailWind, ta tâche est de générer du code HTML avec TailWind en fonction du prompt de l'utilisateur"+
       ", Tu renvoie uniquement du HTML sans texte avant ou après. Tu renvoie du HTML valide. Tu ne renvoie jamais de balises markdown"+
       "goal  :'generate valid code HTML with TailWind classes from a prompt"+
       "critteria : 'generate valid HTML code with TailWind classes, you never write javascript, python or any other programming language'"
       },
      { role: "user", content: prompt }],

  });

  let code = '';
  const onNewChunck = createTimeUpdateIframe();

  for await (const message of response) {
    const isDone = message.choices[0].finish_reason === 'stop';
    const token = message.choices[0].delta?.content;
    code += token;
    if(isDone){

    }
    onNewChunck(code);
    //process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }

  //const code = chatCompletion.choices[0].message.content;

  //console.log('code : '+code);

  return;
 

});

const createTimeUpdateIframe = () => {
  let date = new Date();
  let timeout : any = null;

  return (code: string) => {
    if(new Date().getTime() - date.getTime() > 1000){
      updateIframe(code);
      date = new Date();
    }

    if(timeout){
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      updateIframe(code);
    },1000);

}
}

const updateIframe = (code: string) => {
  iframe.srcdoc = '<!DOCTYPE HTML><html><head><script src="https://cdn.tailwindcss.com"></script></head><body>'+code+'</body></html>';
}
