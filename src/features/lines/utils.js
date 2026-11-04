export function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function shuffle(list) {
  const result = [...list]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

export function makeOptions(correctId, items) {
  return {
    options: shuffle(items),
    answer: correctId,
  }
}

export function makeChoiceOptions(correct, distractors) {
  const labels = shuffle([correct, ...distractors]).filter(
    (label, index, all) => all.indexOf(label) === index,
  )
  const options = labels.map((label, index) => ({
    id: `option-${index}`,
    label,
  }))

  return {
    options,
    answerId: options.find((option) => option.label === correct).id,
  }
}

export function formatAngle(value) {
  return `${value}°`
}
