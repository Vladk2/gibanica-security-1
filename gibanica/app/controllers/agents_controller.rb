class AgentsController < ApplicationController
  skip_before_action :authenticate_user, only: [:create]
  before_action :verify_client_cert, only: [:create]
  before_action :agent_params, only: %i[create update]
  before_action :agents_hierarchy_params, only: [:update_hierarchy]
  before_action :set_agent, only: [:update]

  # GET /agents
  def index
    authorize! :read, Agent

    render json: Agent.all
  end

  # POST /agents
  def create
    if agent_params[:id].nil?
      agent = Agent.new(agent_params)

      #if @agent.save
      render json: agent, status: :created
      #else
      #  render json: agent.errors, status: :unprocessable_entity
      #end
    else
      agent = Agent.find(agent_params[:id])

      if agent.update(agent_params)
        render json: @agent, status: :ok
      else
        render json: @agent.errors, status: :unprocessable_entity
      end
    end
  end

  # PUT /agents/1
  def update
    authorize! :update, @agent

    if @agent.update(agent_params)
      AgentsNotifyJob.perform_later(@agent.to_json, @agent.address, '/update')
      render json: @agent, status: :ok
    else
      render json: @agent.errors, status: :unprocessable_entity
    end
  end

  # PATCH /agents/update_hierarchy
  def update_hierarchy
    authorize! :update, Agent
    Agent.batch_update agents_hierarchy_params[:agents]
  end

  private

  def verify_client_cert
    head :not_acceptable unless request.headers['X-TLS-CLIENT-VERIFIED'] == 'SUCCESS'
  end

  def set_agent
    @agent = Agent.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def agent_params
    params.require(:agent).permit(:id, :name, :type, :address, :host, :super, paths: %i[path format])
  end

  def agents_hierarchy_params
    params.permit(agents: %i[id super])
  end
end
