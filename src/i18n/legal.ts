import type { Locale } from './utils';

/**
 * Plain-language legal templates. Not reviewed by a lawyer yet (see TODO-CONTENT.md, "Legal").
 * Contact details are rendered from `site` by LegalPage, never written into the copy.
 */
export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  /** Paragraph shown after the list. */
  note?: string;
}
export interface LegalDoc {
  title: string;
  intro: string;
  sections: LegalSection[];
}
export type LegalId = 'privacy' | 'terms';

export const LEGAL_UPDATED = '2026-11-06';

export const legal: Record<LegalId, Record<Locale, LegalDoc>> = {
  privacy: {
    es: {
      title: 'Política de privacidad',
      intro:
        'Esta página explica qué datos recibe Buildream cuando usas este sitio y qué hacemos con ellos. Intentamos pedir lo mínimo.',
      sections: [
        {
          heading: 'Qué datos recogemos',
          paragraphs: ['Los datos que escribes en el formulario de contacto son:'],
          items: ['Nombre', 'Correo electrónico', 'Empresa (opcional)', 'Servicio de interés', 'Tu mensaje'],
          note: 'Además, el servicio de formularios y el hosting reciben datos técnicos de la conexión, como tu dirección IP y metadatos de la solicitud.',
        },
        {
          heading: 'Para qué los usamos',
          paragraphs: [
            'Usamos los datos del formulario únicamente para responder a tu consulta y coordinar una conversación contigo. No los usamos para publicidad ni los vendemos.',
          ],
        },
        {
          heading: 'Quién procesa el formulario',
          paragraphs: [
            'El formulario se envía mediante {processor}, un servicio externo que recibe lo que escribes y lo entrega a nuestro correo. {processor} actúa como encargado del envío; su propio tratamiento de datos se rige por su política de privacidad.',
            'El sitio se aloja en el proveedor de hosting, actualmente {host}, que como cualquier servidor web recibe datos técnicos de tu visita (por ejemplo tu dirección IP y metadatos de la solicitud) y puede guardarlos en registros de acceso.',
            'Si prefieres no usar el formulario, puedes escribirnos por correo o WhatsApp.',
          ],
        },
        {
          heading: 'Cookies y analítica',
          paragraphs: [
            'Este sitio no instala cookies ni usa herramientas de analítica o seguimiento. Si eso cambia, actualizaremos esta página antes de hacerlo.',
          ],
        },
        {
          heading: 'Cuánto tiempo los conservamos',
          paragraphs: [
            'Conservamos tu mensaje mientras dure nuestra conversación y el tiempo razonable que haga falta para dar seguimiento. Si nos lo pides, lo eliminamos antes.',
          ],
        },
        {
          heading: 'Tus derechos',
          paragraphs: [
            'Puedes pedirnos acceder a tus datos, corregirlos o eliminarlos escribiendo al correo de contacto de esta página. Respondemos lo antes posible. Tratamos tus datos conforme a la normativa costarricense de protección de datos.',
          ],
        },
        {
          heading: 'Cambios en esta política',
          paragraphs: ['Si la actualizamos, cambiaremos la fecha de última actualización que aparece arriba.'],
        },
      ],
    },
    en: {
      title: 'Privacy policy',
      intro:
        'This page explains what data Buildream receives when you use this site and what we do with it. We try to ask for as little as possible.',
      sections: [
        {
          heading: 'What data we collect',
          paragraphs: ['The data you type into the contact form is:'],
          items: ['Name', 'Email address', 'Company (optional)', 'Service you are interested in', 'Your message'],
          note: 'In addition, the form service and the hosting provider receive technical connection data, such as your IP address and request metadata.',
        },
        {
          heading: 'What we use it for',
          paragraphs: [
            'We use the form data only to reply to your inquiry and set up a conversation with you. We do not use it for advertising and we do not sell it.',
          ],
        },
        {
          heading: 'Who processes the form',
          paragraphs: [
            'The form is sent through {processor}, an external service that receives what you type and delivers it to our email. {processor} acts as the processor of the delivery; its own handling of data is governed by its privacy policy.',
            'The site is served by the hosting provider, currently {host}, which like any web server receives technical data about your visit (for example your IP address and request metadata) and may keep it in access logs.',
            'If you would rather not use the form, you can write to us by email or WhatsApp.',
          ],
        },
        {
          heading: 'Cookies and analytics',
          paragraphs: [
            'This site does not set cookies and does not use analytics or tracking tools. If that changes, we will update this page before it does.',
          ],
        },
        {
          heading: 'How long we keep it',
          paragraphs: [
            'We keep your message for as long as our conversation lasts, plus a reasonable time for follow-up. If you ask us to, we delete it sooner.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You can ask us to access, correct or delete your data by writing to the contact email on this page. We reply as soon as we can. We handle your data in line with Costa Rican data protection law.',
          ],
        },
        {
          heading: 'Changes to this policy',
          paragraphs: ['If we update it, we will change the last-updated date shown above.'],
        },
      ],
    },
  },
  terms: {
    es: {
      title: 'Términos de uso',
      intro: 'Estas condiciones aplican al uso de este sitio web. Al navegarlo, aceptas lo que sigue.',
      sections: [
        {
          heading: 'Un sitio informativo',
          paragraphs: [
            'Este sitio presenta los servicios de Buildream. Su contenido es informativo y no constituye una oferta vinculante ni asesoría profesional para tu caso concreto.',
          ],
        },
        {
          heading: 'Sin garantía de resultados',
          paragraphs: [
            'Describimos lo que hacemos y cómo trabajamos, pero no garantizamos resultados específicos por usar este sitio ni por contactarnos. Los resultados de un proyecto dependen de su contexto.',
          ],
        },
        {
          heading: 'Cotizaciones por proyecto',
          paragraphs: [
            'Los precios y plazos se acuerdan por proyecto, por escrito, después de una conversación. Lo que se muestra en el sitio es una referencia, no una cotización.',
          ],
        },
        {
          heading: 'Propiedad intelectual',
          paragraphs: [
            'Los textos, el diseño y la marca de este sitio pertenecen a Buildream. Puedes compartir enlaces a él, pero no copiar ni reutilizar su contenido sin permiso por escrito. Las marcas de terceros que aparecen pertenecen a sus dueños.',
          ],
        },
        {
          heading: 'Enlaces externos',
          paragraphs: [
            'El sitio enlaza a páginas de terceros (por ejemplo LinkedIn, GitHub o proyectos de ejemplo). No controlamos su contenido y no somos responsables de él.',
          ],
        },
        {
          heading: 'Uso adecuado',
          paragraphs: ['No uses el sitio ni su formulario para enviar spam, contenido ilegal o intentos de acceso no autorizado.'],
        },
        {
          heading: 'Ley aplicable',
          paragraphs: ['Estos términos se rigen por las leyes de Costa Rica.'],
        },
        {
          heading: 'Cambios',
          paragraphs: ['Podemos actualizar estos términos. La fecha de última actualización aparece arriba.'],
        },
      ],
    },
    en: {
      title: 'Terms of use',
      intro: 'These terms apply to your use of this website. By browsing it, you accept what follows.',
      sections: [
        {
          heading: 'An informational site',
          paragraphs: [
            'This site presents Buildream services. Its content is informational and is not a binding offer or professional advice for your specific case.',
          ],
        },
        {
          heading: 'No guarantee of results',
          paragraphs: [
            'We describe what we do and how we work, but we do not guarantee specific results from using this site or contacting us. The outcome of a project depends on its context.',
          ],
        },
        {
          heading: 'Quotes are per project',
          paragraphs: [
            'Prices and timelines are agreed per project, in writing, after a conversation. What the site shows is a reference, not a quote.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'The text, design and brand of this site belong to Buildream. You may link to it, but you may not copy or reuse its content without written permission. Third-party trademarks shown belong to their owners.',
          ],
        },
        {
          heading: 'External links',
          paragraphs: [
            'The site links to third-party pages (for example LinkedIn, GitHub or sample projects). We do not control their content and are not responsible for it.',
          ],
        },
        {
          heading: 'Acceptable use',
          paragraphs: ['Do not use the site or its form to send spam, illegal content or attempts at unauthorized access.'],
        },
        {
          heading: 'Governing law',
          paragraphs: ['These terms are governed by the laws of Costa Rica.'],
        },
        {
          heading: 'Changes',
          paragraphs: ['We may update these terms. The last-updated date is shown above.'],
        },
      ],
    },
  },
};
