import './globals.css'

export const metadata = {
  title: 'FonoClinic',
  description: 'Sistema clínico inteligente para atendimento fonoaudiológico'
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
