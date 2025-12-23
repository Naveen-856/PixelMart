import Stripe from "stripe";
import { getUserFromDB } from "@/lib/getUserFromDB";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const user = await getUserFromDB();

    if (!user) {
        return new Response(JSON.stringify({ error: "Please sign in" }), { status: 401 });
    }

    const { priceId } = await req.json();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/?package_success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/packages`,
        metadata: {
            userId: user._id.toString(),
        },
    });

    return Response.json({ url: session.url });
}