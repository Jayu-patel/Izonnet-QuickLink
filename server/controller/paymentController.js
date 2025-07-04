const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Appointment = require("../models/Appointment")

const checkoutSession=async(req,res)=>{
    try{
        const { appointmentId, amount, name } = req.body;
        const {id} = req.user
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Appointment with Doctor ${name}`,
                },
                unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `http://localhost:5173/success-payment?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/cancel-payment`,
        metadata: {
            appointmentId,
            userId: id,
        },
        });
        res.status(200).json({ id: session.id });

    }
    catch(error){
        return res.status(500).json({message: error.message})
    }
}

const verifyPayment=async(req,res)=>{
    try{
        const {sessionId} = req.body
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const userId = session.metadata.userId;
            const appointmentId = session.metadata.appointmentId;

            await Appointment.findByIdAndUpdate(appointmentId, {payment: true})
            return res.status(200).json({ success: true, message: 'Payment verified', session });
        } else {
            return res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    }
    catch(error){
        return res.status(500).json({message: error.message})
    }

}

module.exports = {
    checkoutSession,
    verifyPayment
}