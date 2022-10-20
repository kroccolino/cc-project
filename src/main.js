import "./css/index.css"
import imask from "imask"

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g> g:nth-child(1) > path"
) //#app > section > div.cc-bg > svg > g > g:nth-child(1) > path

const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g> g:nth-child(2) > path"
)

const ccLogo = document.querySelector(".cc-logo > span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
setCardType("mastercard")

//#security-code
const cvc = document.querySelector("#security-code")

const cvcMasked = IMask(cvc, {
  mask: "0000",
})
const expirationElement = document.querySelector("#expiration-date")
const expirationPattern = IMask(expirationElement, {
  mask: "MM/YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: new Date().getFullYear().toString().slice(2) * 1,
      to: new Date().getFullYear().toString().slice(2) * 1 + 10,
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
})
const cardNumberInput = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const maskFound = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return maskFound
  },
}
const cardNumberMasked = IMask(cardNumberInput, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", (d) => {
  d.preventDefault()
  console.log("vc clicou no butão")
  alert("cartão adicionado")
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "Fulano da Silva" : cardHolder.value
})

cvcMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = cvcMasked.value.length === 0 ? "123" : cvcMasked.value
})

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  const cardNum = document.querySelector(
    "#app > section > div.cc-info > div.cc-number"
  )
  cardNum.innerText =
    cardNumberInput.value.length === 0
      ? "1234 5678 9012 3456"
      : cardNumberInput.value
})

expirationPattern.on("accept", () => {
  updateExpDate(expirationPattern.value)
})

function updateExpDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
