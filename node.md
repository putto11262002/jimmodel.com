# Command to create a new droplet

```bash
doctl compute droplet create template --size s-4vcpu-8gb-240gb-intel \
--project-id 25402edc-4590-4a92-a97d-bc938a1994f7 \
--region sgp1 \
--ssh-keys 41337518 \
--image ubuntu-20-04-x64
```

## Pipe IP to ssh

```bash
doctl compute droplet get 454296406 --format PublicIPv4 --no-header | xargs -I {} ssh root@{}
```

## User Data

```bash
# Update and Upgrade
sudo apt update
```

```bash
# Installing Neovim
sudo apt install -y neovim
```

```bash
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker


```

```bash
# Ask for username
read -p "Enter non-root username: " username

# create user with username and set home directory, with no password
sudo useradd -m -d /home/$username -s /bin/bash $username
sudo passwd -d $username



# Add user to sudo and docker group
sudo usermod -aG sudo $username
sudo usermod -aG docker $username

# Create user .ssh directory
sudo -u $username mkdir /home/$username/.ssh

# Copy root .ssh to user .ssh
sudo cp -r /root/.ssh /home/$username/

# Change ownership of .ssh to user
sudo chown -R $username:$username /home/$username/.ssh

# Change permissions of .ssh
sudo chmod 700 /home/$username/.ssh
sudo chmod 600 /home/$username/.ssh/authorized_keys



```
