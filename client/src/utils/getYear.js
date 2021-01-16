export const getYear = (age) => {
  const num10 = age % 10
  const num100 = age % 100

  if(num10 >=5 || !num10 || num100 == 1) return "лет"
  if (num10 >= 2) return "года"
  return "год"
}