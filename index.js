
 /// <summary>
 /// Load File to S3 Bucket 
 /// </summary>
async function loadFile(event) {
    var image = document.getElementById('output');
    var fileName = event.target.files[0].name;
    const rawResponse = await fetch(`https://localhost:44356/api/S3/upload?fileName=${fileName}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      body: `fileName=${fileName}`
    });
  const content = await rawResponse.json(); 
  console.log("uploaded image");
  console.log(content);
  image.src = content;
}
 /// <summary>
 /// Expand Image using Adobe Firefly Service
 /// </summary>
async function expand()
{
    var selectedsize = document.getElementById("sizelist")
    var size = selectedsize.options[selectedsize.selectedIndex].text;  
    var dimentions = size.toString().split("x");
    var imageUrl = document.getElementById('output').src;
    let payload = {
        "image": {
          "source": {
            "url": imageUrl
          }
        },
        "size": {
          "width": dimentions[1],
          "height": dimentions[0]
        }
      };

    const rawResponse = await fetch("https://localhost:44356/api/Image/expand", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
  const content = await rawResponse.json(); 
  var expandImage = document.getElementById('expandoutput');
  expandImage.src = content;

  console.log("expanded image");
  console.log(content);
}

 /// <summary>
 /// Remove BackGround from the Image using Adobe Firefly Service
 /// </summary>
async function removeBackground()
{
    var imageUrl = document.getElementById('output').src;

      let payload = {
        "input": {
          "href": imageUrl,
          "storage": "external"
        },
        "output": {
          "href": imageUrl,
          "storage": "external",
          "mask": {
            "format": "soft"
          }
        }
      };

    const rawResponse = await fetch("https://localhost:44356/api/Image/remove-background", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
  let content = await rawResponse.json();
  
  console.log("response");
  console.log(content);
  console.log(content.link.self.status, content.link.self.href);

  var rbImage = document.getElementById('removebackGroundoutput');
  if(content.link.self.status == "succeeded")
    rbImage.src = imageUrl;
  else
    rbImage.src = ""; 

    console.log("removed background image");
    console.log(imageUrl);
    
}

/// <summary>
 /// Blur Depth using Adobe Firefly Service
 /// </summary>
async function blurDepth()
{
    var imageUrl = document.getElementById('output').src;
      let payload = {
       "inputs": [
            {
            "href": imageUrl,
            "storage": "external"
            }
       ],
        "options": {
            "haze": 25,
            "blurStrength": 30,
            "focalSelector": {
                "x": 0.22,
                "y": 0.33
            }
        },
        "outputs": [
            {
            "storage": "external",
            "type": "image/jpeg",
            "href": imageUrl
            }
        ]
    };

    const rawResponse = await fetch("https://localhost:44356/api/Image/depth-blur", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
  let content = await rawResponse.json(); 
  console.log("response");
  console.log(content);
  console.log(content.link.self.status, content.link.self.href);
  
  var blurDepthImage = document.getElementById('blurDepthoutput');
  if(content.link.self.status == "succeeded")
      blurDepthImage.src = imageUrl;
  else
      blurDepthImage.src = "";

      console.log("blurred image");
      console.log(imageUrl);
}