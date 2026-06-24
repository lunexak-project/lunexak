// Mock email service for development
const sendEmail = async ({ to, subject, text, html }) => {
  console.log("\n=================== EMAIL SENT ===================");
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("--------------------------------------------------");
  if (text) console.log(text);
  if (html) console.log("HTML CONTENT:", html);
  console.log("==================================================\n");
  
  // In a real app, you would use nodemailer here:
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({ from: '...', to, subject, text, html });
  
  return true;
};

const sendOrderConfirmation = async (user, order) => {
  const subject = `Order Confirmation #${order._id.toString().slice(-6).toUpperCase()}`;
  const text = `Hi ${user.name},\n\nThank you for your order! Your order #${order._id} has been placed successfully.\nTotal: ₹${order.priceSummary?.total || 0}\n\nWe will notify you when it dispatches.`;
  await sendEmail({ to: user.email, subject, text });
};

const sendOrderStatusUpdate = async (user, order) => {
  const subject = `Order Update #${order._id.toString().slice(-6).toUpperCase()}`;
  const text = `Hi ${user.name},\n\nYour order #${order._id} status has been updated to: ${order.status}.\n\nThank you for shopping with LunexAK!`;
  await sendEmail({ to: user.email, subject, text });
};

const sendPasswordReset = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  const subject = `Password Reset Request`;
  const text = `Hi ${user.name},\n\nYou requested a password reset. Please go to this link to reset your password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;
  await sendEmail({ to: user.email, subject, text });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendPasswordReset
};
