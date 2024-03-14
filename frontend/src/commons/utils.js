const parseEmail = (emailText) => {
  const subject = emailText.split("\n")[0].replace("Subject:", "");
  const emailBody = emailText.split("\n").splice(1).join("\n");

  return {
    body: emailBody,
    subject,
  };
};

export { parseEmail };
