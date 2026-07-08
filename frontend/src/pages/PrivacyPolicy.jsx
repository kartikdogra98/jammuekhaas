const PrivacyPolicy = () => (
  <div className="container-app py-16 max-w-3xl prose dark:prose-invert">
    <h1 className="font-display text-3xl font-bold mb-6">Privacy Policy</h1>
    <p className="text-slate-600 dark:text-slate-300 mb-4">
      We collect information you provide directly to us, such as your name, email, phone number, and
      delivery addresses, to process orders and improve our service.
    </p>
    <p className="text-slate-600 dark:text-slate-300 mb-4">
      Payment details are processed securely through Razorpay; we do not store your card or banking
      information on our servers.
    </p>
    <p className="text-slate-600 dark:text-slate-300 mb-4">
      We do not sell your personal data to third parties. Information may be shared with restaurant
      and delivery partners solely to fulfill your orders.
    </p>
    <p className="text-slate-600 dark:text-slate-300">
      You may request access, correction, or deletion of your personal data at any time by contacting
      our support team.
    </p>
  </div>
);

export default PrivacyPolicy;
