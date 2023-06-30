

function isNumeric(str: string) {
    return /^\d*\.?\d+$/.test(str);
  }
  
  
  export const Duration = () => {
    function formatDuration(seconds: number): string {
      const daySeconds = 24 * 60 * 60;
      const hourSeconds = 60 * 60;
      const minuteSeconds = 60;
    
      const days = Math.floor(seconds / daySeconds);
      const hours = Math.floor((seconds % daySeconds) / hourSeconds);
      const minutes = Math.floor(((seconds % daySeconds) % hourSeconds) / minuteSeconds);
      const remainingSeconds = seconds % minuteSeconds;
    
      const dayString = days > 0 ? `${days} Day` : '';
      const hourString = hours > 0 ? `${hours} Hour` : '';
      const minuteString = minutes > 0 ? `${minutes} Min` : '';
      const secondString = remainingSeconds > 0 ? `${remainingSeconds} Sec` : '';
    
      // return `${dayString} ${hourString} ${minuteString} ${secondString}`;
      return `${dayString}`;
    }
  
    // No
    function secondsSince(startDateTime: string): number {
      /**
       * 
       * @param startDateTime 
       * @returns seconds
       */
      const startDate = new Date(startDateTime);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);
      return seconds;
    }
    
    const startDateTime = '2023-05-17 11:14:40';
    const seconds = secondsSince(startDateTime);
  
  
    return (
      <div>
        <script>
  
        </script>
        Start From {'2023-06-06'}, Already Run {formatDuration(seconds)}
  
      </div>
    )
  
  }

  export default Duration;