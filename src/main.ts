

import {openai} from './openAI';

const form = document.querySelector('#generated-form') as HTMLFormElement;
const iframe = document.querySelector('#generated-code') as HTMLIFrameElement;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const prompt = formData.get('prompt') as string;
  
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Tu crées des sites web avec tailWind, ta tâche est de générer du code HTML avec TailWind en fonction du prompt de l'utilisateur"+
       ", Tu renvoie uniquement du HTML sans texte avant ou après. Tu renvoie du HTML valide. Tu ne renvoie jamais de balises markdown" },
      { role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  const code = chatCompletion.choices[0].message.content;

  //console.log('code : '+code);

  if(!code) {
    alert('aucun code généré');
    return;
  }

  iframe.srcdoc = "<html><head><script src='https://cdn.tailwindcss.com'></script></head><body>" + String(code) + "</body></html>";

});