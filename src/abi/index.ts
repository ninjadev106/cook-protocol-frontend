import { IABIs } from "types";

import BasicIssuanceAbi from "./json/basicIssuance.json";
import CkAbi from "./json/ck.json";
import ControllerAbi from "./json/controller.json";
import FactoryAbi from "./json/factory.json";
import GovernanceAbi from "./json/governance.json";
import IntegrationRegistryAbi from "./json/integrationRegistry.json";
import MDexFactoryAbi from "./json/mdexFactory.json";
import MDexPairAbi from "./json/mdexPair.json";
import MDexRouterAbi from "./json/mdexRouter.json";
import SingleIndexModuleAbi from "./json/singleIndexModule.json";
import StreamingFeeAbi from "./json/streamingFee.json";
import TradeModuleAbi from "./json/tradeModule.json";
import WrapModuleAbi from "./json/wrapModule.json";

export const ABIs: IABIs = {
  factory: FactoryAbi,
  controller: ControllerAbi,
  streamingFee: StreamingFeeAbi,
  ck: CkAbi,
  basicIssuance: BasicIssuanceAbi,
  integrationRegistry: IntegrationRegistryAbi,
  governance: GovernanceAbi,
  wrapModule: WrapModuleAbi,
  tradeModule: TradeModuleAbi,
  singleIndexModule: SingleIndexModuleAbi,
  mdexFactory: MDexFactoryAbi,
  mdexPair: MDexPairAbi,
  mdexRouter: MDexRouterAbi,
};
