import { MqttClient } from "mqtt"
import { Optional } from "utility-types";
import { Base } from "./base"
import { IHABinarySensorConfig, IBinarySensorOptions } from "../interfaces/binary_sensor"
import { ClassTypes } from "../interfaces/common"

export type IBinarySensorConfig = Optional<IHABinarySensorConfig, "stateTopic">


export class BinarySensor extends Base {
  constructor(mqttClient: MqttClient, name: string, config?: IBinarySensorConfig) {
    super(
      mqttClient, 
      ClassTypes.BINARY_SENSOR,
      {
        name,
        stateTopic: config?.stateTopic || `jstomqtt/${name}_jstomqtt/state`,
        ...config,
      },
    )
    
    this.name = name
    
    this.publishConfig()
    this.setupListener()
  }
  public readonly name: string
  public readonly config: IBinarySensorConfig;
  private _state: IBinarySensorOptions

  public get state (): IBinarySensorOptions {
    return this._state
  }
  
  private pushState (state: string): void { 
    this.logger.debug(`Pushing state: ${state}`)
    this.client.publish(
      this.config.stateTopic, 
      state,
      { retain: true },
    )
  }

  public on (): void {
    this._state = IBinarySensorOptions.ON
    this.pushState(this._state.toString())
  }

  public off (): void {
    this._state = IBinarySensorOptions.OFF
    this.pushState(this._state.toString())
  }
}
