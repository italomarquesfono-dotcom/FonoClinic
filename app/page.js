'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase'

const areas = [
  'Audiologia',
  'Voz',
  'Fala',
  'Linguagem',
  'Fluência',
  'Motricidade Orofacial',
  'Deglutição',
  'Aprendizagem',
  'Desenvolvimento Infantil',
  'Comunicação Social'
]

const perguntas = {
  Audiologia: [
    ['Dificuldade para ouvir?', 'audicao'],
    ['Dificuldade para compreender a fala?', 'fala'],
    ['Zumbido?', 'zumbido'],
    ['Sensação de ouvido tampado?', 'tampado'],
    ['Exposição a ruído?', 'ruido'],
    ['Tontura ou desequilíbrio?', 'tontura'],
    ['Usa aparelho auditivo?', 'aparelho']
  ],
  Voz: [
    ['Rouquidão ou alteração da voz?', 'rouquidao'],
    ['Cansaço ao falar?', 'cansaco'],
    ['Dor ao falar?', 'dor'],
    ['Uso profissional da voz?', 'profissional'],
    ['Pigarro frequente?', 'pigarro'],
    ['Refluxo ou azia?', 'refluxo']
  ],
  Fala: [
    ['Trocas ou omissões de sons?', 'trocas'],
    ['Fala pouco inteligível?', 'inteligibilidade'],
    ['Dificuldade de articulação?', 'articulacao'],
    ['Histórico neurológico?', 'neurologico']
  ],
  Linguagem: [
    ['Dificuldade de compreensão?', 'compreensao'],
    ['Dificuldade para expressar ideias?', 'expressao'],
    ['Vocabulário reduzido?', 'vocabulario'],
    ['Dificuldade para contar histórias?', 'narrativa']
  ],
  Fluência: [
    ['Repetição de sons ou sílabas?', 'repeticoes'],
    ['Prolongamentos ou bloqueios?', 'bloqueios'],
    ['Tensão durante a fala?', 'tensao'],
    ['Impacto emocional/social?', 'impacto']
  ],
  'Motricidade Orofacial': [
    ['Respiração oral?', 'respiracao'],
    ['Mastigação alterada?', 'mastigacao'],
    ['Postura inadequada da língua/lábios?', 'postura'],
    ['Alteração das funções orofaciais?', 'funcoes']
  ],
  Deglutição: [
    ['Tosse ou engasgos ao comer?', 'engasgo'],
    ['Sensação de alimento parado?', 'residuo'],
    ['Voz molhada após engolir?', 'voz'],
    ['Dificuldade alimentar ou perda de peso?', 'peso']
  ],
  Aprendizagem: [
    ['Dificuldade de leitura?', 'leitura'],
    ['Dificuldade de escrita?', 'escrita'],
    ['Dificuldade de consciência fonológica?', 'fonologia'],
    ['Dificuldade de compreensão textual?', 'texto']
  ],
  'Desenvolvimento Infantil': [
    ['Atraso na aquisição da fala?', 'atraso'],
    ['Poucas palavras para a idade?', 'palavras'],
    ['Dificuldade de compreensão?', 'compreensao'],
    ['Dificuldade de interação/comunicação?', 'social']
  ],
  'Comunicação Social': [
    ['Dificuldade de interação?', 'interacao'],
    ['Dificuldade de comunicação não verbal?', 'naoverbal'],
    ['Dificuldade de conversação?', 'conversa'],
    ['Comunicação funcional reduzida?', 'funcional']
  ]
}

function sim(v) {
  return String(v).toLowerCase() === 'sim'
}

function gerarResultado(area, respostas) {
  const h = []
  const e = []
  const a = []

  const s = k => sim(respostas[k])

  if (area === 'Audiologia') {
    if (s('audicao') || s('fala')) {
      h.push('Possível alteração da função auditiva. Necessária avaliação audiológica.')
      e.push('Audiometria tonal e vocal')
      e.push('Imitanciometria')
    }
    if (s('zumbido')) {
      h.push('Queixa de zumbido a investigar.')
      e.push('Avaliação audiológica completa')
    }
    if (s('tontura')) {
      a.push('Considerar investigação vestibular e avaliação médica conforme sinais clínicos.')
    }
  }

  if (area === 'Voz' && (s('rouquidao') || s('cansaco'))) {
    h.push('Possível alteração vocal.')
    e.push('Avaliação perceptivo-auditiva da voz')
    e.push('Avaliação acústica da voz, quando indicada')
  }

  if (area === 'Fala' && (s('trocas') || s('articulacao'))) {
    h.push('Possível alteração fonético-fonológica/articulatória.')
    e.push('Avaliação fonético-fonológica')
  }

  if (area === 'Linguagem' &&
      (s('compreensao') || s('expressao') || s('vocabulario'))) {
    h.push('Possível alteração de linguagem receptiva e/ou expressiva.')
    e.push('Avaliação de linguagem')
    e.push('Amostra de linguagem')
  }

  if (area === 'Fluência' &&
      (s('repeticoes') || s('bloqueios') || s('tensao'))) {
    h.push('Possível alteração da fluência.')
    e.push('Avaliação de fluência')
    e.push('Amostra de fala espontânea')
  }

  if (area === 'Motricidade Orofacial' &&
      (s('respiracao') || s('mastigacao') || s('postura'))) {
    h.push('Possível alteração miofuncional orofacial.')
    e.push('Avaliação miofuncional orofacial')
  }

  if (area === 'Deglutição' &&
      (s('engasgo') || s('residuo') || s('voz'))) {
    h.push('Sinais que justificam investigação da deglutição.')
    e.push('Avaliação clínica da deglutição')
    a.push('Investigar risco de aspiração conforme avaliação clínica.')
  }

  if (area === 'Aprendizagem' &&
      (s('leitura') || s('escrita') || s('fonologia'))) {
    h.push('Possível alteração relacionada à linguagem escrita/aprendizagem.')
    e.push('Avaliação de linguagem escrita')
    e.push('Avaliação de consciência fonológica')
  }

  if (area === 'Desenvolvimento Infantil' &&
      (s('atraso') || s('palavras') || s('compreensao') || s('social'))) {
    h.push('Possível alteração do desenvolvimento da comunicação.')
    e.push('Avaliação de linguagem infantil')
    e.push('Avaliação do desenvolvimento comunicativo')
  }

  if (area === 'Comunicação Social' &&
      (s('interacao') || s('naoverbal') || s('conversa') || s('funcional'))) {
    h.push('Possível alteração de comunicação social/pragmática.')
    e.push('Avaliação pragmática e comunicação social')
  }

  if (!h.length) h.push('Nenhuma hipótese automática. Completar avaliação clínica.')
  if (!e.length) e.push('Definir exames conforme avaliação clínica.')

  return { h, e, a }
}

export default function Home() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [area, setArea] = useState('Audiologia')
  const [aba, setAba] = useState('inicio')
  const [nome, setNome] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [queixa, setQueixa] = useState('')
  const [historico, setHistorico] = useState('')
  const [respostas, setRespostas] = useState({})
  const [pacientes, setPacientes] = useState([])
  const [selecionado, setSelecionado] = useState(null)

  const resultado = useMemo(
    () => gerarResultado(area, respostas),
    [area, respostas]
  )

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data } = supabase.auth.onAuthStateChange(
      (_event, sessionAtual) => {
        setSession(sessionAtual)
      }
    )

    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) carregarPacientes()
  }, [session])

  async function entrar(e) {
    e.preventDefault()
    setErro('')

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha
      })

    if (error) setErro(error.message)
  }

  async function carregarPacientes() {
    const { data } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setPacientes(data)
  }

  async function salvar() {
    if (!nome.trim()) {
      alert('Digite o nome do paciente.')
      return
    }

    const { data, error } = await supabase
      .from('patients')
      .insert({
        full_name: nome,
        birth_date: nascimento || null,
        phone: telefone,
        chief_complaint: queixa,
        history: historico,
        area: area,
        anamnesis_answers: respostas,
        hypotheses: resultado.h,
        suggested_exams: resultado.e,
        clinical_alerts: resultado.a
      })
      .select()
      .single()

    if (error) {
      alert('Erro ao salvar: ' + error.message)
      return
    }

    setSelecionado(data)
    setPacientes([data, ...pacientes])
    setAba('resultado')
  }

  if (!session) {
    return (
      <main className="page">
        <div className="login">
          <h1>FonoClinic</h1>
          <p>Atendimento fonoaudiológico</p>

          <form onSubmit={entrar} className="card">
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </label>

            {erro && <p className="error">{erro}</p>}

            <button>Entrar</button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="page">

      <header className="topbar">
        <div>
          <h1>FonoClinic</h1>
          <small>Sistema clínico fonoaudiológico</small>
        </div>

        <button
          className="secondary"
          onClick={() => supabase.auth.signOut()}
        >
          Sair
        </button>
      </header>

      <nav className="tabs">
        <button onClick={() => setAba('inicio')}>Painel</button>
        <button onClick={() => setAba('anamnese')}>Nova anamnese</button>
        <button onClick={() => setAba('pacientes')}>Pacientes</button>
        <button onClick={() => setAba('resultado')}>Resultado</button>
      </nav>

      {aba === 'inicio' && (
        <section className="grid">

          <div className="card stat">
            <span>Pacientes</span>
            <strong>{pacientes.length}</strong>
          </div>

          <div className="card stat">
            <span>Área</span>
            <strong>{area}</strong>
          </div>

          <div className="card">
            <h2>Novo atendimento</h2>
            <p>Inicie uma nova anamnese fonoaudiológica.</p>

            <button onClick={() => setAba('anamnese')}>
              Iniciar atendimento
            </button>
          </div>

        </section>
      )}

      {aba === 'anamnese' && (
        <section className="card">

          <h2>Nova Anamnese</h2>

          <label>
            Área clínica
            <select
              value={area}
              onChange={e => {
                setArea(e.target.value)
                setRespostas({})
              }}
            >
              {areas.map(x => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>

          <label>
            Nome completo
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </label>

          <label>
            Data de nascimento
            <input
              type="date"
              value={nascimento}
              onChange={e => setNascimento(e.target.value)}
            />
          </label>

          <label>
            Telefone
            <input
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
            />
          </label>

          <label>
            Queixa principal
            <textarea
              value={queixa}
              onChange={e => setQueixa(e.target.value)}
            />
          </label>

          <label>
            Histórico
            <textarea
              value={historico}
              onChange={e => setHistorico(e.target.value)}
            />
          </label>

          <h2>Perguntas dirigidas</h2>

          {(perguntas[area] || []).map(([texto, chave]) => (
            <label className="question" key={chave}>
              {texto}

              <select
                value={respostas[chave] || ''}
                onChange={e =>
                  setRespostas({
                    ...respostas,
                    [chave]: e.target.value
                  })
                }
              >
                <option value="">Selecione</option>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </label>
          ))}

          <button onClick={salvar}>
            Salvar atendimento
          </button>

        </section>
      )}

      {aba === 'pacientes' && (
        <section className="card">

          <h2>Pacientes</h2>

          {pacientes.length === 0 ? (
            <p>Nenhum paciente cadastrado.</p>
          ) : (
            pacientes.map(p => (
              <button
                className="patient"
                key={p.id}
                onClick={() => {
                  setSelecionado(p)
                  setAba('resultado')
                }}
              >
                <strong>{p.full_name}</strong>
                <span>{p.area}</span>
              </button>
            ))
          )}

        </section>
      )}

      {aba === 'resultado' && (
        <section className="card">

          <h2>Resultado clínico</h2>

          <h3>
            {selecionado?.full_name || nome || 'Paciente'}
          </h3>

          <p>
            Área: {selecionado?.area || area}
          </p>

          <h3>Hipóteses / pontos para investigar</h3>

          <ul>
            {(selecionado?.hypotheses || resultado.h).map(
              (x, i) => <li key={i}>{x}</li>
            )}
          </ul>

          <h3>Exames / protocolos sugeridos</h3>

          <ul>
            {(selecionado?.suggested_exams || resultado.e).map(
              (x, i) => <li key={i}>{x}</li>
            )}
          </ul>

          <h3>Alertas</h3>

          <ul>
            {(selecionado?.clinical_alerts || resultado.a).length
              ? (selecionado?.clinical_alerts || resultado.a).map(
                  (x, i) => <li key={i}>{x}</li>
                )
              : <li>Nenhum alerta automático.</li>
            }
          </ul>

          <h3>Plano terapêutico</h3>

          <textarea
            placeholder="Objetivos, condutas, orientações e encaminhamentos..."
          />

          <button onClick={() => window.print()}>
            Imprimir / Salvar PDF
          </button>

          <p className="disclaimer">
            As sugestões automáticas servem como apoio à organização
            e ao raciocínio clínico e não substituem avaliação,
            diagnóstico, protocolos validados ou julgamento profissional.
          </p>

        </section>
      )}

    </main>
  )
}
