export const es = {
  defaults: {
    eyebrow: 'Cuba esta cerca',
    title: 'Nuestro countdown',
    note: 'Convex mantiene el mismo contador para los nicknames sincronizados.',
  },
  profile: {
    empty: 'Sin perfil',
    with: (partner: string) => `con ${partner}`,
  },
  readout: {
    caption: 'dias restantes',
    loading: 'Cargando tiempo restante',
    label: (days: number, hours: number, minutes: number, seconds: number) =>
      `${days} dias, ${hours} horas, ${minutes} minutos y ${seconds} segundos restantes`,
  },
  progress: {
    percent: (progress: number) => `${progress}% recorrido`,
    elapsed: (elapsed: number, total: number) => `${elapsed} de ${total} dias`,
    waitingSetup: 'Esperando configurar el conteo',
    waitingNickname: 'Esperando tu nickname',
  },
  summary: {
    createdBy: (owner: string, date: string) =>
      `Conteo creado por ${owner} el ${date}.`,
    editMessages: 'Editar mensajes',
  },
  loading: {
    shared: 'Cargando countdown compartido...',
    completeSteps: 'Completa los pasos iniciales para empezar.',
  },
  setup: {
    nickname: {
      eyebrow: 'Primer inicio',
      title: 'Tu nickname',
      description: 'Este nombre identifica tu countdown en Convex.',
      label: 'Nickname',
      submit: 'Continuar',
    },
    partner: {
      eyebrow: 'Sincronizacion',
      title: 'Nickname de ella',
      description:
        'Si ya existe y tiene conteo, te preguntare si quieres unirte a ese countdown.',
      label: 'Nickname de la otra persona',
      submit: 'Revisar nickname',
    },
    sync: {
      eyebrow: 'Conteo encontrado',
      title: 'Sincronizarse?',
      description: (nickname: string, remainingDays: number | null) =>
        `${nickname} ya tiene un countdown${
          remainingDays !== null ? ` con ${remainingDays} dias restantes` : ''
        }.`,
      createOwn: 'Crear el mio',
      submit: 'Sincronizarme',
    },
    days: {
      eyebrow: 'Countdown',
      title: 'Cuantos dias faltan?',
      description:
        'Este conteo quedara guardado en Convex para poder compartirlo.',
      label: 'Dias restantes',
      submit: 'Guardar countdown',
    },
    messages: {
      eyebrow: 'Personalizar',
      title: 'Editar mensajes',
      eyebrowLabel: 'Encabezado',
      titleLabel: 'Titulo',
      noteLabel: 'Nota',
      cancel: 'Cancelar',
      submit: 'Guardar',
    },
  },
  errors: {
    nicknameTooShort: 'Escribe al menos 2 caracteres.',
    nicknameTooLong: 'Usa 32 caracteres o menos.',
    sameNickname: 'Usa el nickname de la otra persona.',
    invalidDays: 'Escribe un numero entero de dias.',
    saveNickname: 'No se pudo guardar tu nickname.',
    checkNickname: 'No se pudo revisar ese nickname.',
    sync: 'No se pudo sincronizar el countdown.',
    createCountdown: 'No se pudo crear el countdown.',
    saveMessages: 'No se pudieron guardar los mensajes.',
  },
} as const
