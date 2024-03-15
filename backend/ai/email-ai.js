import OpenAI from "openai";

let openAIClient = null;

async function getOpenAIClient() {
  if (!openAIClient) {
    await init();
  }
  return openAIClient;
}

async function init() {
  openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

//we pass params for openai API which will come from postman
async function generateEmail(params) {
  console.info({
    id: "generateEmail",
    message: "generating email",
    prompt: params,
  });

  const openai = await getOpenAIClient();

  const prompt = `
            You have to write an email from ${params?.professor?.Name} to ${
    params?.collaborator?.Name
  } with regards to collaboration on similar domains. \
  The email should be written in such a way that it seems like it's written by ${
    params.professor?.Name
  }.  \

            You will be provided with the the parameters for the email in JSON format.\

            Parameters:
            ${JSON.stringify(params)}
        `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an email generation expert.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  console.info({
    id: "generateEmail",
    message: "Email recieved. ",
    response: response.choices,
  });

  const email = response.choices[0]?.message?.content;
  return email;
}

export { init, generateEmail };
