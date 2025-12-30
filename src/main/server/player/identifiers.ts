import logger from "../logging/logger";

function getLicense2(netId: number): string | undefined {
  const license2 = GetPlayerIdentifierByType(netId.toString(), 'license2');

  if (undefined === license2 || null === license2) {
    logger.warn(`did not find a license2 player identifier for net id ${netId}`);
    return undefined;
  }

  // raw result looks like this: "license2:dflgjhdflghjdfsgjlhdfs", so we split the prefix
  return license2.split(':')[1];
}

const playerIdentifiers = {
  getLicense2
};

export default playerIdentifiers;
