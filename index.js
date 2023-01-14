const currencyRates = {
  AED: 9,
  USD: 30,
};

const ONLINE_PRICE = "online-price";
const OFFLINE_PRICE = "offline-price";
const TAXES_PERCENTAGE = "conversion-taxes";
const CURRENCY = "source-currency";
const NUMBER_FORM_ITEMS = [TAXES_PERCENTAGE, ONLINE_PRICE, OFFLINE_PRICE];

function start() {
  const form = document.getElementById("convertForm");

  form?.addEventListener("submit", function (e) {
    e.preventDefault();

    const formattedValues = getFormattedValues(form);
    const conversionRate = currencyRates[formattedValues[CURRENCY]];

    const { onlinePrice, gatePrice, amountGained } = getPrices(
      formattedValues,
      conversionRate
    );

    if (onlinePrice === gatePrice) {
      alert("The same");
      return;
    }

    if (onlinePrice > gatePrice) {
      alert(`
            Offline is better, buy at the gate ( ${amountGained} EGP saving)
            Offline = ${gatePrice} EGP
            Online  =  ${onlinePrice} EGP
      `);
    } else {
      alert(`
            Online is better ( ${amountGained} EGP saving)
            Offline = ${gatePrice} EGP
            Online  =  ${onlinePrice} EGP
      `);
    }
  });
}

function getFormattedValues(form) {
  const formData = new FormData(form);
  const formProps = Object.fromEntries(formData);

  let formattedValues = {};
  Object.entries(formProps).forEach((item) => {
    const [key, value] = item;
    const shouldFormatAsNumber = NUMBER_FORM_ITEMS.includes(key);
    formattedValues = {
      ...formattedValues,
      [key]: shouldFormatAsNumber ? (value ? parseFloat(value) : 0) : value,
    };
  });
  return formattedValues;
}

function getPrices(formattedValues, conversionRate) {
  const baseOnlinePrice = formattedValues[ONLINE_PRICE];
  const baseOfflinePrice = formattedValues[OFFLINE_PRICE];

  const taxes = formattedValues[TAXES_PERCENTAGE] * baseOnlinePrice;

  const onlinePrice = Math.round((baseOnlinePrice + taxes) * conversionRate);
  const gatePrice = baseOfflinePrice * conversionRate;

  const amountGained = Math.abs(onlinePrice - gatePrice);

  return { onlinePrice, gatePrice, amountGained };
}

window.addEventListener("load", start);
