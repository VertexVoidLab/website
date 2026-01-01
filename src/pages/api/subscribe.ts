export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ message: "Email required" }), { status: 400 });
        }

        const { error: dbError } = await supabase
            .from('subscribers')
            .insert([{ email, source: 'vertex-void-v1' }]);

        // Ignore duplicate email errors (code 23505), but throw others
        if (dbError && dbError.code !== '23505') {
            console.error('Supabase Error:', dbError);
            return new Response(JSON.stringify({ message: "Database Error" }), { status: 500 });
        }

        const ASSET_URL = "https://cajxonjmcyjizavjazsh.supabase.co/storage/v1/object/public/assets/TiltCard_FREE_1.zip";

        const { error: emailError } = await resend.emails.send({
            from: 'Vertex Void <source@vertexvoidlab.com>',
            replyTo: 'vertexvoidlab@gmail.com',
            to: [email],
            subject: 'Download: Tilt Card Component',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vertex Void Asset</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #111111; border: 1px solid #333333; border-radius: 12px;">
                  <tr>
                    <td style="padding: 40px;">
                      
                      <h1 style="margin: 0 0 24px 0; color: #ffffff; font-size: 20px; letter-spacing: -0.5px;">
                        Vertex Void Lab
                      </h1>
                      
                      <p style="margin: 0 0 24px 0; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                        Welcome to the lab. Here is the production-ready component code you requested.
                      </p>
                      
                      <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="border-radius: 6px;" bgcolor="#ffffff">
                            <a href="${ASSET_URL}" target="_blank" style="font-size: 16px; font-weight: bold; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; border: 1px solid #ffffff;">
                              Download Source Code &rarr;
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 32px 0 0 0; color: #52525b; font-size: 12px;">
                        Includes: TiltCard.tsx, GlassSkin.tsx, and Demo Scene.<br>
                        License: MIT (Free for commercial use).
                      </p>
                      
                    </td>
                  </tr>
                </table>
                
                <p style="margin-top: 24px; color: #3f3f46; font-size: 12px; text-align: center;">
                  Sent by Adams from Vertex Void Lab.
                </p>

              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
        });

        if (emailError) {
            console.error('Resend Error:', emailError);
            return new Response(JSON.stringify({ message: "Failed to send email" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error('Server Error:', error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
};
