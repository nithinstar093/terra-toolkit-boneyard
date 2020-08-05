import TerraService from './TerraService';
import SeleniumDockerService from './SeleniumDockerService';
import ServeStaticService from './ServeStaticService';
import LightHouseService from './LightHouseService';

module.exports.Terra = new TerraService();
module.exports.SeleniumDocker = new SeleniumDockerService();
module.exports.ServeStaticService = new ServeStaticService();
module.exports.LightHouseService = new LightHouseService();
