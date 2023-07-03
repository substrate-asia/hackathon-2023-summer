import os
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
from tqdm import tqdm 

# Set up Azure Logging
db_url = 'https://labapex.documents.azure.com:443/'
db_key = 'ZLrVux84ipkVbA9OTMyQ1YswiarrBIswBB7ILAiyLxJkRYoUW3e7M2IjPHjdqbd4AdfPjQ3XPjkSACDbYVf8uw=='
connection_string = "DefaultEndpointsProtocol=https;AccountName=kejie1;AccountKey=wKggITwQijuI4m+7nNyH9XC1JuYsaY8O3ftrhdgDNXVLKYtgV0mvgdPhN3fw/0slGFUTuGVdnKw9+AStVkOoEw==;EndpointSuffix=core.windows.net"

# Set up CIFAR10 dataset
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

trainset = torchvision.datasets.CIFAR100(root=os.path.dirname(os.path.dirname(os.path.realpath(__file__))), train=True, download=False, transform=transform)
train_dataloader = torch.utils.data.DataLoader(trainset, batch_size=32, shuffle=True, num_workers=2)

testset = torchvision.datasets.CIFAR100(root=os.path.dirname(os.path.dirname(os.path.realpath(__file__))), train=False, download=False, transform=transform)
test_loader = torch.utils.data.DataLoader(testset, batch_size=32, shuffle=False, num_workers=2)

# Set up model, loss function, and optimizer
model = torchvision.models.resnet18(pretrained=True)
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 100)  # CIFAR100 has 100 classes
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.0008)
epochs = 2

# Train the model
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('--container', type=str, default='client_podkat', help='The Container Name')
    args = parser.parse_args()

    container_name = args.container
    from BahenLogging import LoggingCallback
    callback = LoggingCallback(db_url, db_key, connection_string, container_name)
    # Start collecting metrics
    callback.start_logging()

    # Train the model
    for epoch in range(epochs):
        running_loss = 0.0
        progress_bar = tqdm(enumerate(train_dataloader), total=len(train_dataloader))
        for i, data in progress_bar:
            inputs, labels = data[0].to(device), data[1].to(device)

            optimizer.zero_grad()

            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            # print statistics
            progress_bar.set_description(f'At epoch = {epoch} Iter = {i}, the loss = {loss.item():.5f}, ')
            # Log the loss to Azure
            callback.log_loss(loss.item(), epoch, i, epochs, len(train_dataloader))

        # Save and upload the model checkpoint after each epoch
        model_checkpoint_name = f"model_epoch_{epoch}.pt"
        callback.save_and_upload_model(model, model_checkpoint_name)

    print('Finished Training')

    # Stop collecting metrics
    callback.stop_logging()



