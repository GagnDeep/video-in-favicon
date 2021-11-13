<script lang="ts">
  import { resizeFavicon, setFavicon } from "./helpers/favicon";
  import "./lib/TailwindCSS.svelte";

  let videoRef: HTMLVideoElement;
  let canvasRef: HTMLCanvasElement;
  let screenshotUrl: string;
  let videoUrl = `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4`;

  /**
   * take screenshot of a video
   * @param {HTMLVideoElement} video
   * @param {HTMLCanvasElement} canvas
   * @param {number} time
   * @returns {Promise<string>}
   */
  function takeScreenshot(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    time: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")!
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      } else {
        video.addEventListener("canplay", () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas
            .getContext("2d")!
            .drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        });
      }
    });
  }



  /**
   * get video current time
   * @param {HTMLVideoElement} video
   * @returns {number}
   * @see https://stackoverflow.com/a/52724095/104380
   */
  function getVideoCurrentTime(video: HTMLVideoElement): number {
    return video.currentTime || 0;
  }



  /**
   * take screenshot on video time update each second
   * @param {Event} e
   * @returns {Promise<void>}
   */
  async function handleVideoTimeUpdate(e: Event): Promise<void> {
    const video = videoRef;
    const time = getVideoCurrentTime(video);
    const dataUrl = await takeScreenshot(video, canvasRef, time);
    screenshotUrl = await resizeFavicon(dataUrl);
    setFavicon(screenshotUrl);
  }
</script>

<video
  src={videoUrl}
  controls
  bind:this={videoRef}
  crossorigin="anonymous"
  on:timeupdate={handleVideoTimeUpdate}
/>
<canvas id="canvas" bind:this={canvasRef} class="hidden" />
