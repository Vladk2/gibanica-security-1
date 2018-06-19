Rails.application.routes.draw do
  root to: proc { [404, {}, []] }

  resources :users, only: %i[] do
    collection do
      post :login
      post :email_valid
      post :password_reset_link
      post :reset_password
    end
  end

  resources :agents, only: %i[index create update] do
    collection do
      patch :update_hierarchy
    end
  end

  resources :logs, only: %i[index create] do
    collection do
      get :monthly_status
      get :host_status
      get :system_status
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
