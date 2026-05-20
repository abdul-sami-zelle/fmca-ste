import * as gtag from '@/utils/gtag'

export default function ExampleButton() {
  const handleClick = () => {
    gtag.event({
      action: 'click_button',
      params: {
        category: 'engagement',
        label: 'Signup Button',
      },
    })
  }

  return <button onClick={handleClick}>Sign Up</button>
}
