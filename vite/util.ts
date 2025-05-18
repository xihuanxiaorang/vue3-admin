export function processEnv(env: Record<string, string>) {
  const parsedEnv: Record<string, string | boolean | number> = {}
  Object.entries(env).forEach(([key, value]) => {
    if (value === 'true' || value === 'false') {
      parsedEnv[key] = value === 'true'
    } else if (/^[-+]?\d*\.?\d+$/.test(value)) {
      parsedEnv[key] = Number(value)
    } else {
      parsedEnv[key] = value
    }
  })
  return parsedEnv
}
