class SimpleHTMLComponent {
  root: HTMLDivElement
  shadow: ShadowRoot
  htmlTemplate: string
  style: string = ""

  constructor() {
    const div = document.createElement("div")
    this.shadow = div.attachShadow({
      mode: "closed"
    })
    this.htmlTemplate = ""
    this.root = div
    this.template = this.template.bind(this)
  }

  styled(css: string) {
    this.style = css

    const style = document.createElement("style")
    style.innerHTML = css
    this.shadow.insertBefore(this.shadow.querySelector("div")!, style)
  }

  template(t: string) {
    this.htmlTemplate = t
    this.root.innerHTML = t
  }

  inject() {
    window.document.body.append(this.root)
  }
}

export default SimpleHTMLComponent
