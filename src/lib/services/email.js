import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

let transporter = null;

function getTransporter() {
	if (transporter) return transporter;

	const host = env.SMTP_HOST;
	const port = parseInt(env.SMTP_PORT || '587', 10);
	const user = env.SMTP_USER;
	const pass = env.SMTP_PASSWORD;

	if (!host || !user || !pass) {
		throw new Error('SMTP non configuré (SMTP_HOST, SMTP_USER, SMTP_PASSWORD manquants)');
	}

	transporter = nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass }
	});

	return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
	const from = env.SMTP_FROM || 'AFMEF <no-reply@afmef.bj>';
	try {
		const info = await getTransporter().sendMail({ from, to, subject, html, text });
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error('Erreur sendEmail:', error);
		return { success: false, error: error.message };
	}
}

function wrap(title, bodyHtml) {
	return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F5F7FA; margin: 0; padding: 24px; color: #1F2937; }
  .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .header { background: #1E3A8A; color: #fff; padding: 24px 32px; }
  .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
  .content { padding: 28px 32px; line-height: 1.6; font-size: 15px; }
  .content p { margin: 0 0 16px; }
  .cta { display: inline-block; background: #1E3A8A; color: #fff !important; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: 600; margin-top: 8px; }
  .footer { padding: 16px 32px; font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid #E5E7EB; }
</style>
</head>
<body>
  <div class="card">
    <div class="header"><h1>${title}</h1></div>
    <div class="content">${bodyHtml}</div>
    <div class="footer">AFMEF — Amicale des Femmes du Ministère de l'Économie et des Finances</div>
  </div>
</body>
</html>`;
}

export function sendCotisationReminder(user, cotisation) {
	const publicUrl = env.PUBLIC_APP_URL || 'https://afmef.bj';
	const amount = new Intl.NumberFormat('fr-FR').format(cotisation.amount);
	const html = wrap(
		'Rappel de cotisation',
		`<p>Bonjour <strong>${user.name || ''}</strong>,</p>
		<p>Nous vous rappelons que votre cotisation de <strong>${amount} FCFA</strong> pour l'année <strong>${cotisation.year}</strong> est toujours en attente de règlement.</p>
		<p>Vous pouvez régulariser directement depuis votre espace membre :</p>
		<p><a class="cta" href="${publicUrl}/espace-membre/cotisations">Payer ma cotisation</a></p>
		<p style="margin-top: 24px; color: #6B7280; font-size: 13px;">Si vous avez déjà effectué le règlement, merci d'ignorer ce message.</p>`
	);

	return sendEmail({
		to: user.email,
		subject: `Rappel — Cotisation AFMEF ${cotisation.year}`,
		html,
		text: `Bonjour ${user.name || ''}, votre cotisation de ${amount} FCFA pour ${cotisation.year} est en attente. Régler depuis ${publicUrl}/espace-membre/cotisations`
	});
}

export function sendMemberValidationEmail(user) {
	const publicUrl = env.PUBLIC_APP_URL || 'https://afmef.bj';
	const html = wrap(
		'Votre compte AFMEF est actif',
		`<p>Bonjour <strong>${user.name || ''}</strong>,</p>
		<p>Bonne nouvelle : votre inscription à l'AFMEF vient d'être validée par l'équipe d'administration.</p>
		<p>Vous pouvez maintenant vous connecter à votre espace membre et accéder à l'annuaire, aux ressources et au suivi de vos cotisations.</p>
		<p><a class="cta" href="${publicUrl}/espace-membre/connexion">Accéder à mon espace</a></p>`
	);

	return sendEmail({
		to: user.email,
		subject: 'Bienvenue à l\'AFMEF — votre compte est actif',
		html,
		text: `Bonjour ${user.name || ''}, votre compte AFMEF a été validé. Connectez-vous sur ${publicUrl}/espace-membre/connexion`
	});
}
