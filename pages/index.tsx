import type { NextPage } from 'next'
import Head from 'next/head'
import Webcam from 'react-webcam'
import {Form, Select, Slider} from 'antd'
import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css'
import React from 'react'

interface CameraControll {
  provided: boolean
  min: number
  max: number
  step: number
}

const defaultControll = {
  provided: false,
  min: 0,
  max: 0,
  step: 0,
}

const Home: NextPage = () => {
  const [deviceId, setDeviceId] = React.useState("")
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([])
  const [capabilitiesJson, setCapabilitiesJson] = React.useState("")
  const [settingsJson, setSettingsJson] = React.useState("")
  const [brightnessControll, setBrightnessControll] = React.useState<CameraControll>(defaultControll)
  const [currentBrightness, setCurrentBrightness] = React.useState(0)
  const [contrastControll, setContrastControll] = React.useState<CameraControll>(defaultControll)
  const [currentContrast, setCurrentContrast] = React.useState(0)
  const [saturationControll, setSaturationControll] = React.useState<CameraControll>(defaultControll)
  const [currentSaturation, setCurrentSaturation] = React.useState(0)
  const [sharpnessControll, setSharpnessControll] = React.useState<CameraControll>(defaultControll)
  const [currentSharpness, setCurrentSharpness] = React.useState(0)
  const webcamRef = React.useRef<Webcam>(null)

  const handleSelectDevice = (selectedId: string) => {
    setDeviceId(selectedId)
  }

  const handleDevices = React.useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput"))
    }, [setDevices]
  );

  React.useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices]
  );

  React.useEffect(
    () => {
      if (webcamRef.current?.stream) {
        webcamRef.current.stream.getVideoTracks()[0].applyConstraints(
          {
            advanced: [
              {brightness: currentBrightness}
            ]
          }
        )
      }
    },
    [currentBrightness]
  )

  React.useEffect(
    () => {
      if (webcamRef.current?.stream) {
        webcamRef.current.stream.getVideoTracks()[0].applyConstraints(
          {
            advanced: [
              {contrast: currentContrast}
            ]
          }
        )
      }
    },
    [currentContrast]
  )

  React.useEffect(
    () => {
      if (webcamRef.current?.stream) {
        webcamRef.current.stream.getVideoTracks()[0].applyConstraints(
          {
            advanced: [
              {saturation: currentSaturation}
            ]
          }
        )
      }
    },
    [currentSaturation]
  )

  React.useEffect(
    () => {
      if (webcamRef.current?.stream) {
        webcamRef.current.stream.getVideoTracks()[0].applyConstraints(
          {
            advanced: [
              {sharpness: currentSharpness}
            ]
          }
        )
      }
    },
    [currentSharpness]
  )

  const onStreamChanged = (stream: MediaStream) => {
    console.log("onStreamChanged", stream)
    const tracks = stream.getVideoTracks()
    if (tracks.length > 0) {
      const id = tracks[0].getSettings().deviceId
      if (id && deviceId === "") {
        setDeviceId(id)
      }
    }

    if(devices.length === 1 && devices[0].deviceId === "") {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }

    if(!webcamRef.current || !webcamRef.current.stream){
      console.log("webcamRef is null")
      return
    }

    const cap = webcamRef.current.stream.getVideoTracks()[0].getCapabilities()
    setCapabilitiesJson(JSON.stringify(cap, null, 2))
    const settings = webcamRef.current.stream.getVideoTracks()[0].getSettings()
    setSettingsJson(JSON.stringify(settings, null, 2))

    if (cap.brightness !== undefined && settings.brightness !== undefined) {
      setBrightnessControll({
        provided: true,
        min: cap.brightness.min,
        max: cap.brightness.max,
        step: cap.brightness.step
      })
      setCurrentBrightness(settings.brightness)
    } else {
      setBrightnessControll(defaultControll)
    }

    if (cap.contrast !== undefined && settings.contrast !== undefined) {
      setContrastControll({
        provided: true,
        min: cap.contrast.min,
        max: cap.contrast.max,
        step: cap.contrast.step
      })
      setCurrentContrast(settings.contrast)
    } else {
      setContrastControll(defaultControll)
    }

    if (cap.saturation !== undefined && settings.saturation !== undefined) {
      setSaturationControll({
        provided: true,
        min: cap.saturation.min,
        max: cap.saturation.max,
        step: cap.saturation.step
      })
      setCurrentSaturation(settings.saturation)
    } else {
      setSaturationControll(defaultControll)
    }

    if (cap.sharpness !== undefined && settings.sharpness !== undefined) {
      setSharpnessControll({
        provided: true,
        min: cap.sharpness.min,
        max: cap.sharpness.max,
        step: cap.sharpness.step
      })
      setCurrentSharpness(settings.sharpness)
    } else {
      setSharpnessControll(defaultControll)
    }

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Form className={styles.devices}>
          <Form.Item label="カメラデバイス">
            <Select onSelect={handleSelectDevice} value={deviceId}>
              {devices.map((device, key) => (
                <Select.Option key={device.deviceId} value={device.deviceId}>{device.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="明るさ">
            <Slider
              disabled={!brightnessControll.provided}
              min={brightnessControll.min}
              max={brightnessControll.max}
              step={brightnessControll.step}
              value={currentBrightness}
              onChange={(v) => setCurrentBrightness(v)}
            ></Slider>
          </Form.Item>
          <Form.Item label="コントラスト">
            <Slider
              disabled={!contrastControll.provided}
              min={contrastControll.min}
              max={contrastControll.max}
              step={contrastControll.step}
              value={currentContrast}
              onChange={(v) => setCurrentContrast(v)}
            ></Slider>
          </Form.Item>
          <Form.Item label="彩度">
            <Slider
              disabled={!saturationControll.provided}
              min={saturationControll.min}
              max={saturationControll.max}
              step={saturationControll.step}
              value={currentSaturation}
              onChange={(v) => setCurrentSaturation(v)}
            ></Slider>
          </Form.Item>
          <Form.Item label="鮮明度">
            <Slider
              disabled={!sharpnessControll.provided}
              min={sharpnessControll.min}
              max={sharpnessControll.max}
              step={sharpnessControll.step}
              value={currentSharpness}
              onChange={(v) => setCurrentSharpness(v)}
            ></Slider>
          </Form.Item>
        </Form>
        <div>
          <Webcam
            videoConstraints={{deviceId: deviceId, width: 640, height: 480}}
            audio={false}
            onUserMedia={onStreamChanged}
            ref={webcamRef}
            className="input"
          ></Webcam>
        </div>
        <div>
          {capabilitiesJson}
        </div>
        <div>
          {settingsJson}
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

export default Home
